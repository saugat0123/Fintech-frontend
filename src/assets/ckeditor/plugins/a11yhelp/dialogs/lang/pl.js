/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'pl', {
	title: 'Instrukcje dotyczące dostępności',
	contents: 'Zawartość pomocy. Wciśnij ESC, aby zamknąć to okno.',
	legend: [
		{
		name: 'Informacje ogólne',
		items: [
			{
			name: 'Pasek narzędzi edytora',
			legend: 'Naciśnij ${toolbarFocus}, by przejść do paska narzędzi. Przejdź do następnej i poprzedniej grupy narzędzi używając TAB oraz SHIFT+TAB. Przejdź do następnego i poprzedniego przycisku paska narzędzi za pomocą STRZAŁKI W PRAWO lub STRZAŁKI W LEWO. Naciśnij SPACJĘ lub ENTER by aktywować przycisk paska narzędzi.'
		},

			{
			name: 'Okno dialogowe edytora',
			legend:
				'Wewnątrz okna dialogowego naciśnij TAB, by przejść do kolejnego elementu tego okna lub SHIFT+TAB, by przejść do poprzedniego elementu okna. Naciśnij ENTER w celu zatwierdzenia opcji okna dialogowego lub ESC w celu anulowania zmian. Jeśli okno dialogowe ma kilka zakładek, do listy zakładek można przejść za pomocą ALT+F10 lub TAB. Gdy lista zakładek jest aktywna, możesz przejść do kolejnej i poprzedniej zakładki za pomocą STRZAŁKI W PRAWO i STRZAŁKI W LEWO.' 
		},

			{
			name: 'Menu kontekstowe edytora',
			legend: 'Wciśnij ${contextMenu} lub PRZYCISK APLIKACJI aby otworzyć menu kontekstowe. Przejdź do następnej pozycji menu wciskając TAB lub STRZAŁKĘ W DÓŁ. Przejdź do poprzedniej pozycji menu wciskając SHIFT + TAB lub STRZAŁKĘ W GÓRĘ. Wciśnij SPACJĘ lub ENTER aby wygrać pozycję menu. Otwórz pod-menu obecnej pozycji wciskając SPACJĘ lub ENTER lub STRZAŁKĘ W PRAWO. Wróć do pozycji nadrzędnego menu wciskając ESC lub STRZAŁKĘ W LEWO. Zamknij menu wciskając ESC.'
		},

			{
			name: 'Lista w edytorze',
			legend: 'Wewnątrz listy przejdź do kolejnego elementu listy za pomocą przycisku TAB lub STRZAŁKI W DÓŁ. Przejdź do poprzedniego elementu listy za pomocą SHIFT+TAB lub STRZAŁKI W GÓRĘ. Naciśnij SPACJĘ lub ENTER w celu wybrania opcji z listy. Naciśnij ESC, by zamknąć listę.'
		},

			{
			name: 'Pasek ścieżki elementów edytora',
			legend: 'Naciśnij ${elementsPathFocus} w celu przejścia do paska ścieżki elementów edytora. W celu przejścia do kolejnego elementu naciśnij klawisz TAB lub STRZAŁKI W PRAWO. W celu przejścia do poprzedniego elementu naciśnij klawisze SHIFT+TAB lub STRZAŁKI W LEWO. By wybrać element w edytorze, użyj klawisza SPACJI lub ENTER.'
		}
		]
	},
		{
		name: 'Polecenia',
		items: [
			{
			name: 'Polecenie Cofnij',
			legend: 'Naciśnij ${undo}'
		},
			{
			name: 'Polecenie Ponów',
			legend: 'Naciśnij ${redo}'
		},
			{
			name: 'Polecenie Pogrubienie',
			legend: 'Naciśnij ${bold}'
		},
			{
			name: 'Polecenie Kursywa',
			legend: 'Naciśnij ${italic}'
		},
			{
			name: 'Polecenie Podkreślenie',
			legend: 'Naciśnij ${underline}'
		},
			{
			name: 'Polecenie Wstaw/ edytuj odnośnik',
			legend: 'Naciśnij ${link}'
		},
			{
			name: 'Polecenie schowaj pasek narzędzi',
			legend: 'Naciśnij ${toolbarCollapse}'
		},
			{
			name: 'Przejdź do poprzedniego miejsca, w którym można ustawić focus',
			legend: 'Naciśnij ${accessPreviousSpace}, aby przejść do najbliższego niedostępnego miejsca przed kursorem, w którym można ustawić focus. Przykład: dwa przylegające elementy HR. Powtórz ten skrót klawiaturowy, by dotrzeć do kolejnych takich miejsc.'
		},
			{
			name: 'Przejdź do następnego miejsca, w którym można ustawić focus',
			legend: 'Naciśnij ${accessNextSpace}, aby przejść do najbliższego niedostępnego miejsca po kursorze, w którym można ustawić focus. Przykład: dwa przylegające elementy HR. Powtórz ten skrót klawiaturowy, by dotrzeć do kolejnych takich miejsc.'
		},
			{
			name: 'Pomoc dotycząca dostępności',
			legend: 'Naciśnij ${a11yHelp}'
		},
			{
			name: 'Wklej jako tekst',
			legend: 'Naciśnij ${pastetext}',
			legendEdge: 'Naciśnij ${pastetext}, a następnie ${paste}'
		}
		]
	}
	],
	tab: 'Tab',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	leftArrow: 'Strzałka w lewo',
	upArrow: 'Strzałka w górę',
	rightArrow: 'Strzałka w prawo',
	downArrow: 'Strzałka w dół',
	insert: 'Insert',
	leftWindowKey: 'Lewy klawisz Windows',
	rightWindowKey: 'Prawy klawisz Windows',
	selectKey: 'Klawisz wyboru',
	numpad0: 'Klawisz 0 na klawiaturze numerycznej',
	numpad1: 'Klawisz 1 na klawiaturze numerycznej',
	numpad2: 'Klawisz 2 na klawiaturze numerycznej',
	numpad3: 'Klawisz 3 na klawiaturze numerycznej',
	numpad4: 'Klawisz 4 na klawiaturze numerycznej',
	numpad5: 'Klawisz 5 na klawiaturze numerycznej',
	numpad6: 'Klawisz 6 na klawiaturze numerycznej',
	numpad7: 'Klawisz 7 na klawiaturze numerycznej',
	numpad8: 'Klawisz 8 na klawiaturze numerycznej',
	numpad9: 'Klawisz 9 na klawiaturze numerycznej',
	multiply: 'Przemnóż',
	add: 'Plus',
	subtract: 'Minus',
	decimalPoint: 'Separator dziesiętny',
	divide: 'Podziel',
	f1: 'F1',
	f2: 'F2',
	f3: 'F3',
	f4: 'F4',
	f5: 'F5',
	f6: 'F6',
	f7: 'F7',
	f8: 'F8',
	f9: 'F9',
	f10: 'F10',
	f11: 'F11',
	f12: 'F12',
	numLock: 'Num Lock',
	scrollLock: 'Scroll Lock',
	semiColon: 'Średnik',
	equalSign: 'Znak równości',
	comma: 'Przecinek',
	dash: 'Pauza',
	period: 'Kropka',
	forwardSlash: 'Ukośnik prawy',
	graveAccent: 'Akcent słaby',
	openBracket: 'Nawias kwadratowy otwierający',
	backSlash: 'Ukośnik lewy',
	closeBracket: 'Nawias kwadratowy zamykający',
	singleQuote: 'Apostrof'
} );
