/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'pt-br', {
	title: 'Instruções de Acessibilidade',
	contents: 'Conteúdo da Ajuda. Para fechar este diálogo pressione ESC.',
	legend: [
		{
		name: 'Geral',
		items: [
			{
			name: 'Barra de Ferramentas do Editor',
			legend: 'Pressione ${toolbarFocus} para navegar para a barra de ferramentas. Mova para o anterior ou próximo grupo de ferramentas com TAB e SHIFT+TAB. Mova para o anterior ou próximo botão com SETA PARA DIREITA or SETA PARA ESQUERDA. Pressione ESPAÇO ou ENTER para ativar o botão da barra de ferramentas.'
		},

			{
			name: 'Diálogo do Editor',
			legend:
				'Dentro de um diálogo, pressione TAB para navegar para o próximo elemento. Pressione SHIFT+TAB para mover para o elemento anterior. Pressione ENTER ara enviar o diálogo. pressione ESC para cancelar o diálogo. Quando um diálogo tem múltiplas abas, a lista de abas pode ser acessada com ALT+F10 ou TAB, como parte da ordem de tabulação do diálogo. Com a lista de abas em foco, mova para a próxima aba e para a aba anterior com a SETA DIREITA ou SETA ESQUERDA, respectivamente.' 
		},

			{
			name: 'Menu de Contexto do Editor',
			legend: 'Pressione ${contextMenu} ou TECLA DE MENU para abrir o menu de contexto, então mova para a próxima opção com TAB ou SETA PARA BAIXO. Mova para a anterior com SHIFT+TAB ou SETA PARA CIMA. Pressione ESPAÇO ou ENTER para selecionar a opção do menu. Abra o submenu da opção atual com ESPAÇO ou ENTER ou SETA PARA DIREITA. Volte para o menu pai com ESC ou SETA PARA ESQUERDA. Feche o menu de contexto com ESC.'
		},

			{
			name: 'Caixa de Lista do Editor',
			legend: 'Dentro de uma caixa de lista, mova para o próximo item com TAB ou SETA PARA BAIXO. Mova para o item anterior com SHIFT+TAB ou SETA PARA CIMA. Pressione ESPAÇO ou ENTER para selecionar uma opção na lista. Pressione ESC para fechar a caixa de lista.'
		},

			{
			name: 'Barra de Caminho do Elementos do Editor',
			legend: 'Pressione ${elementsPathFocus} para a barra de caminho dos elementos. Mova para o próximo botão de elemento com TAB ou SETA PARA DIREITA. Mova para o botão anterior com SHIFT+TAB ou SETA PARA ESQUERDA. Pressione ESPAÇO ou ENTER para selecionar o elemento no editor.'
		}
		]
	},
		{
		name: 'Comandos',
		items: [
			{
			name: ' Comando Desfazer',
			legend: 'Pressione ${undo}'
		},
			{
			name: ' Comando Refazer',
			legend: 'Pressione ${redo}'
		},
			{
			name: ' Comando Negrito',
			legend: 'Pressione ${bold}'
		},
			{
			name: ' Comando Itálico',
			legend: 'Pressione ${italic}'
		},
			{
			name: ' Comando Sublinhado',
			legend: 'Pressione ${underline}'
		},
			{
			name: ' Comando Link',
			legend: 'Pressione ${link}'
		},
			{
			name: ' Comando Fechar Barra de Ferramentas',
			legend: 'Pressione ${toolbarCollapse}'
		},
			{
			name: 'Acessar o comando anterior de spaço de foco',
			legend: 'Pressione ${accessNextSpace} para acessar o espaço de foco não alcançável mais próximo antes do cursor, por exemplo: dois elementos HR adjacentes. Repita a combinação de teclas para alcançar espaços de foco distantes.'
		},
			{
			name: 'Acessar próximo fomando de spaço de foco',
			legend: 'Pressione ${accessNextSpace} para acessar o espaço de foco não alcançável mais próximo após o cursor, por exemplo: dois elementos HR adjacentes. Repita a combinação de teclas para alcançar espaços de foco distantes.'
		},
			{
			name: ' Ajuda de Acessibilidade',
			legend: 'Pressione ${a11yHelp}'
		},
			{
			name: 'Colar como texto sem formatação',
			legend: 'Pressione ${pastetext}',
			legendEdge: 'Pressione ${pastetext}, seguido de ${paste}'
		}
		]
	}
	],
	tab: 'Tecla Tab',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	leftArrow: 'Seta à Esquerda',
	upArrow: 'Seta à Cima',
	rightArrow: 'Seta à Direita',
	downArrow: 'Seta à Baixo',
	insert: 'Insert',
	leftWindowKey: 'Tecla do Windows Esquerda',
	rightWindowKey: 'Tecla do Windows Direita',
	selectKey: 'Tecla Selecionar',
	numpad0: '0 do Teclado Numérico',
	numpad1: '1 do Teclado Numérico',
	numpad2: '2 do Teclado Numérico',
	numpad3: '3 do Teclado Numérico',
	numpad4: '4 do Teclado Numérico',
	numpad5: '5 do Teclado Numérico',
	numpad6: '6 do Teclado Numérico',
	numpad7: '7 do Teclado Numérico',
	numpad8: '8 do Teclado Numérico',
	numpad9: '9 do Teclado Numérico',
	multiply: 'Multiplicar',
	add: 'Mais',
	subtract: 'Subtrair',
	decimalPoint: 'Ponto',
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
	semiColon: 'Ponto-e-vírgula',
	equalSign: 'Igual',
	comma: 'Vírgula',
	dash: 'Hífen',
	period: 'Ponto',
	forwardSlash: 'Barra',
	graveAccent: 'Acento Grave',
	openBracket: 'Abrir Conchetes',
	backSlash: 'Contra-barra',
	closeBracket: 'Fechar Colchetes',
	singleQuote: 'Aspas Simples'
} );
