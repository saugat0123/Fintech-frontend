/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'es', {
	title: 'Instrucciones de accesibilidad',
	contents: 'Ayuda. Para cerrar presione ESC.',
	legend: [
		{
		name: 'General',
		items: [
			{
			name: 'Barra de herramientas del editor',
			legend: 'Presiona ${toolbarFocus} para navegar por la barra de herramientas. Para moverse por los distintos grupos de herramientas usa las teclas TAB y MAY+TAB. Para moverse por las distintas herramientas usa FLECHA DERECHA o FECHA IZQUIERDA. Presiona "espacio" o "intro" para activar la herramienta.'
		},

			{
			name: 'Editor de diálogo',
			legend:
				'Dentro del diálogo, presione TAB para navegar a los siguientes elementos de diálogo, presione SHIFT+TAB para moverse a los anteriores elementos de diálogo, presione ENTER para enviar el diálogo, presiona ESC para cancelar el diálogo. Cuando el diálogo tiene multiples pestañas, la lista de pestañas puede ser abarcada con ALT + F10 or con TAB como parte del orden de pestañas del diálogo. ECon la pestaña enfocada, puede moverse a la siguiente o anterior pestaña con las FLECHAS IZQUIRDA y DERECHA respectivamente.' 
		},

			{
			name: 'Editor del menú contextual',
			legend: 'Presiona ${contextMenu} o TECLA MENÚ para abrir el menú contextual. Entonces muévete a la siguiente opción del menú con TAB o FLECHA ABAJO. Muévete a la opción previa con SHIFT + TAB o FLECHA ARRIBA. Presiona ESPACIO o ENTER para seleccionar la opción del menú. Abre el submenú de la opción actual con ESPACIO o ENTER o FLECHA DERECHA. Regresa al elemento padre del menú con ESC o FLECHA IZQUIERDA. Cierra el menú contextual con ESC.'
		},

			{
			name: 'Lista del Editor',
			legend: 'Dentro de una lista, te mueves al siguiente elemento de la lista con TAB o FLECHA ABAJO. Te mueves al elemento previo de la lista con SHIFT+TAB o FLECHA ARRIBA. Presiona ESPACIO o ENTER para elegir la opción de la lista. Presiona ESC para cerrar la lista.'
		},

			{
			name: 'Barra de Ruta del Elemento en el Editor',
			legend: 'Presiona ${elementsPathFocus} para navegar a los elementos de la barra de ruta. Te mueves al siguiente elemento botón con TAB o FLECHA DERECHA. Te mueves al botón previo con SHIFT+TAB o FLECHA IZQUIERDA. Presiona ESPACIO o ENTER para seleccionar el elemento en el editor.'
		}
		]
	},
		{
		name: 'Comandos',
		items: [
			{
			name: 'Comando deshacer',
			legend: 'Presiona ${undo}'
		},
			{
			name: 'Comando rehacer',
			legend: 'Presiona ${redo}'
		},
			{
			name: 'Comando negrita',
			legend: 'Presiona ${bold}'
		},
			{
			name: 'Comando itálica',
			legend: 'Presiona ${italic}'
		},
			{
			name: 'Comando subrayar',
			legend: 'Presiona ${underline}'
		},
			{
			name: 'Comando liga',
			legend: 'Presiona ${liga}'
		},
			{
			name: 'Comando colapsar barra de herramientas',
			legend: 'Presiona ${toolbarCollapse}'
		},
			{
			name: 'Comando accesar el anterior espacio de foco',
			legend: 'Presiona ${accessPreviousSpace} para accesar el espacio de foco no disponible más cercano anterior al cursor, por ejemplo: dos elementos HR adyacentes. Repite la combinación de teclas para alcanzar espacios de foco distantes.'
		},
			{
			name: 'Comando accesar el siguiente spacio de foco',
			legend: 'Presiona ${accessNextSpace} para accesar el espacio de foco no disponible más cercano después del cursor, por ejemplo: dos elementos HR adyacentes. Repite la combinación de teclas para alcanzar espacios de foco distantes.'
		},
			{
			name: 'Ayuda de Accesibilidad',
			legend: 'Presiona ${a11yHelp}'
		},
			{
			name: ' Paste as plain text', // MISSING
			legend: 'Press ${pastetext}', // MISSING
			legendEdge: 'Press ${pastetext}, followed by ${paste}' // MISSING
		}
		]
	}
	],
	tab: 'Tabulador',
	pause: 'Pausa',
	capslock: 'Bloq. Mayús.',
	escape: 'Escape',
	pageUp: 'Regresar Página',
	pageDown: 'Avanzar Página',
	leftArrow: 'Flecha Izquierda',
	upArrow: 'Flecha Arriba',
	rightArrow: 'Flecha Derecha',
	downArrow: 'Flecha Abajo',
	insert: 'Insertar',
	leftWindowKey: 'Tecla Windows Izquierda',
	rightWindowKey: 'Tecla Windows Derecha',
	selectKey: 'Tecla de Selección',
	numpad0: 'Tecla 0 del teclado numérico',
	numpad1: 'Tecla 1 del teclado numérico',
	numpad2: 'Tecla 2 del teclado numérico',
	numpad3: 'Tecla 3 del teclado numérico',
	numpad4: 'Tecla 4 del teclado numérico',
	numpad5: 'Tecla 5 del teclado numérico',
	numpad6: 'Tecla 6 del teclado numérico',
	numpad7: 'Tecla 7 del teclado numérico',
	numpad8: 'Tecla 8 del teclado numérico',
	numpad9: 'Tecla 9 del teclado numérico',
	multiply: 'Multiplicar',
	add: 'Sumar',
	subtract: 'Restar',
	decimalPoint: 'Punto Decimal',
	divide: 'Dividir',
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
	semiColon: 'Punto y coma',
	equalSign: 'Signo de Igual',
	comma: 'Coma',
	dash: 'Guión',
	period: 'Punto',
	forwardSlash: 'Diagonal',
	graveAccent: 'Acento Grave',
	openBracket: 'Abrir llave',
	backSlash: 'Diagonal Invertida',
	closeBracket: 'Cerrar llave',
	singleQuote: 'Comillas simples'
} );
