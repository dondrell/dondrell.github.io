(function(){
	let opened_cards = [];
	let timerId;
	let timer = document.getElementsByClassName('timer')[0];
	let timer_seconds_value = 60;
	let found_pairs_num = 0;
	let area = document.getElementsByClassName('area')[0];
	initArea();

	function openCard(card){
		card.dataset.side = 'front';
		card.classList.remove('card__rotate-left');
		card.classList.add('card__rotate-right');
	}
	function closeCard(card){
		card.dataset.side = 'back';
		card.classList.remove('card__rotate-right');
		card.classList.add('card__rotate-left');
	}
	function handlePair(opened_cards){
		let fronts = [opened_cards[0].getElementsByClassName('card__front')[0],
					opened_cards[1].getElementsByClassName('card__front')[0]];
		if (fronts[0].textContent === fronts[1].textContent){
			fronts[0].classList.add('card__front__green');
			fronts[1].classList.add('card__front__green');
			opened_cards.splice(0,2);
			if (++found_pairs_num == 6)
				area.dispatchEvent(new Event('gameover'))
		} else{
			fronts[0].classList.toggle('card__front__red');
			fronts[1].classList.toggle('card__front__red');
		}
	}
	function initArea(){
		let symbols = ['🐱','🐟','🐻','🐼','🐨','🐯'];
		let card_indexes = new Array(12);
		for (let i = 0; i < card_indexes.length; i++)
			card_indexes[i] = i+1;

		symbols.forEach(function(item){
			let n = Math.round(Math.random()*(card_indexes.length - 1));
			document.querySelector('.card:nth-child('+card_indexes[n]+')>.card__front').textContent = item;
			card_indexes.splice(n, 1);
		});
		symbols.forEach(function(item){
			let n = Math.round(Math.random()*(card_indexes.length - 1));
			document.querySelector('.card:nth-child('+card_indexes[n]+')>.card__front').textContent = item;
			card_indexes.splice(n, 1);
		});
	}

	area.addEventListener('gameover', function(event){
		clearTimeout(timerId);
		document.getElementsByClassName('gameover-window__text')[0].textContent = found_pairs_num == 6? 'win' : 'lose';
		document.getElementsByClassName('gameover-screen')[0].style.display = 'block';
	});
	area.addEventListener('click', function (event) {
		if (event.target.classList.contains('card__side') && 
			!event.target.classList.contains('card__front__green')){
			let card = event.target.parentNode;

			//if the list has length 2 and it has not been cleared earlier
			//then this list contains 2 red cards
			if (opened_cards.length == 2){
				handlePair(opened_cards);
				//in case of clicking on a card from opened_cards, both ones must close
				if (card.dataset.side === 'front'){
					closeCard(opened_cards[0]);
					closeCard(opened_cards[1]);
					opened_cards = [];
					return;
				}
				closeCard(opened_cards[0]);
				closeCard(opened_cards[1]);
				opened_cards = [];
			}
			

			if (card.dataset.side === 'back'){
				openCard(card);
				opened_cards.push(card);
				if (opened_cards.length == 2)
					handlePair(opened_cards);
			}
			else if (card.dataset.side === 'front'){
				closeCard(card);
				opened_cards = [];
			}

			if (timerId === undefined)
				timerId = setInterval(function(){
					timer.textContent = '00:' + (--timer_seconds_value / 10 < 1? '0'+timer_seconds_value : timer_seconds_value);
					if (timer_seconds_value == 0){
						area.dispatchEvent(new Event('gameover'))
					}
				}, 1000);
		}
	});

	document.getElementsByClassName('gameover-window__button')[0].addEventListener('click', function(){
		document.getElementsByClassName('gameover-screen')[0].style.display = 'none';
		for (let i = 0; i < area.children.length; i++){
			area.children[i].getElementsByClassName('card__front')[0]
				.classList.remove('card__front__green', 'card__front__red');
			closeCard(area.children[i]);
		}
		initArea();
		timer.textContent = '01:00';
		timerId = undefined;
		timer_seconds_value = 60;
		found_pairs_num = 0;
	});
})();