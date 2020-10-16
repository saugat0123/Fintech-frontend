/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'nb', {
	title: 'Instruksjoner for tilgjengelighet',
	contents: 'Innhold for hjelp. Trykk ESC for å lukke denne dialogen.',
	legend: [
		{
		name: 'Generelt',
		items: [
			{
			name: 'Verktøylinje for editor',
			legend: 'Trykk ${toolbarFocus} for å navigere til verktøylinjen. Flytt til neste og forrige verktøylinjegruppe med TAB og SHIFT+TAB. Flytt til neste og forrige verktøylinjeknapp med HØYRE PILTAST og VENSTRE PILTAST. Trykk MELLOMROM eller ENTER for å aktivere verktøylinjeknappen.'
		},

			{
			name: 'Dialog for editor',
			legend:
				'Mens du er i en dialog, trykk TAB for å navigere til neste dialogelement, trykk SHIFT+TAB for å flytte til forrige dialogelement, trykk ENTER for å akseptere dialogen, trykk ESC for å avbryte dialogen. Når en dialog har flere faner, kan fanelisten nås med enten ALT+F10 eller med TAB. Når fanelisten er fokusert, går man til neste og forrige fane med henholdsvis HØYRE og VENSTRE PILTAST.' 
		},

			{
			name: 'Kontekstmeny for editor',
			legend: 'Trykk ${contextMenu} eller MENYKNAPP for å åpne kontekstmeny. Gå til neste alternativ i menyen med TAB eller PILTAST NED. Gå til forrige alternativ med SHIFT+TAB eller PILTAST OPP. Trykk MELLOMROM eller ENTER for å velge menyalternativet. Åpne undermenyen på valgt alternativ med MELLOMROM eller ENTER eller HØYRE PILTAST. Gå tilbake til overordnet menyelement med ESC eller VENSTRE PILTAST. Lukk kontekstmenyen med ESC.'
		},

			{
			name: 'Listeboks for editor',
			legend: 'I en listeboks, gå til neste alternativ i listen med TAB eller PILTAST NED. Gå til forrige alternativ i listen med SHIFT+TAB eller PILTAST OPP. Trykk MELLOMROM eller ENTER for å velge alternativet i listen. Trykk ESC for å lukke listeboksen.'
		},

			{
			name: 'Verktøylinje for elementsti',
			legend: 'Trykk ${elementsPathFocus} for å navigere til verktøylinjen som viser elementsti. Gå til neste elementknapp med TAB eller HØYRE PILTAST. Gå til forrige elementknapp med SHIFT+TAB eller VENSTRE PILTAST. Trykk MELLOMROM eller ENTER for å velge elementet i editoren.'
		}
		]
	},
		{
		name: 'Hurtigtaster',
		items: [
			{
			name: 'Angre',
			legend: 'Trykk ${undo}'
		},
			{
			name: 'Gjør om',
			legend: 'Trykk ${redo}'
		},
			{
			name: 'Fet tekst',
			legend: 'Trykk ${bold}'
		},
			{
			name: 'Kursiv tekst',
			legend: 'Trykk ${italic}'
		},
			{
			name: 'Understreking',
			legend: 'Trykk ${underline}'
		},
			{
			name: 'Lenke',
			legend: 'Trykk ${link}'
		},
			{
			name: 'Skjul verktøylinje',
			legend: 'Trykk ${toolbarCollapse}'
		},
			{
			name: 'Gå til forrige fokusområde',
			legend: 'Trykk ${accessPreviousSpace} for å komme til nærmeste fokusområde før skrivemarkøren som ikke kan nås på vanlig måte, for eksempel to tilstøtende HR-elementer. Gjenta tastekombinasjonen for å komme til fokusområder lenger unna i dokumentet.'
		},
			{
			name: 'Gå til neste fokusområde',
			legend: 'Trykk ${accessNextSpace} for å komme til nærmeste fokusområde etter skrivemarkøren som ikke kan nås på vanlig måte, for eksempel to tilstøtende HR-elementer. Gjenta tastekombinasjonen for å komme til fokusområder lenger unna i dokumentet.'
		},
			{
			name: 'Hjelp for tilgjengelighet',
			legend: 'Trykk ${a11yHelp}'
		},
			{
			name: 'Lim inn som ren tekst',
			legend: 'Trykk ${pastetext}',
			legendEdge: 'Trykk ${pastetext}, etterfulgt av ${past}'
		}
		]
	}
	],
	tab: 'Tabulator',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	leftArrow: 'Venstre piltast',
	upArrow: 'Opp-piltast',
	rightArrow: 'Høyre piltast',
	downArrow: 'Ned-piltast',
	insert: 'Insert',
	leftWindowKey: 'Venstre Windows-tast',
	rightWindowKey: 'Høyre Windows-tast',
	selectKey: 'Velg nøkkel',
	numpad0: 'Numerisk tastatur 0',
	numpad1: 'Numerisk tastatur 1',
	numpad2: 'Numerisk tastatur 2',
	numpad3: 'Numerisk tastatur 3',
	numpad4: 'Numerisk tastatur 4',
	numpad5: 'Numerisk tastatur 5',
	numpad6: 'Numerisk tastatur 6',
	numpad7: 'Numerisk tastatur 7',
	numpad8: 'Numerisk tastatur 8',
	numpad9: 'Numerisk tastatur 9',
	multiply: 'Multipliser',
	add: 'Legg til',
	subtract: 'Trekk fra',
	decimalPoint: 'Desimaltegn',
	divide: 'Divider',
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
	semiColon: 'Semikolon',
	equalSign: 'Likhetstegn',
	comma: 'Komma',
	dash: 'Bindestrek',
	period: 'Punktum',
	forwardSlash: 'Forover skråstrek',
	graveAccent: 'Grav aksent',
	openBracket: 'Åpne parentes',
	backSlash: 'Bakover skråstrek',
	closeBracket: 'Lukk parentes',
	singleQuote: 'Enkelt sitattegn'
} );
