/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'km', {
	title: 'Accessibility Instructions', // MISSING
	contents: 'មាតិកា​ជំនួយ។ ដើម្បី​បិទ​ផ្ទាំង​នេះ សូម​ចុច ESC ។',
	legend: [
		{
		name: 'ទូទៅ',
		items: [
			{
			name: 'របារ​ឧបករណ៍​កម្មវិធី​និពន្ធ',
			legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT+TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
		},

			{
			name: 'ផ្ទាំង​កម្មវិធីនិពន្ធ',
			legend:
				'Inside a dialog, press TAB to navigate to the next dialog element, press SHIFT+TAB to move to the previous dialog element, press ENTER to submit the dialog, press ESC to cancel the dialog. When a dialog has multiple tabs, the tab list can be reached either with ALT+F10 or with TAB as part of the dialog tabbing order. With tab list focused, move to the next and previous tab with RIGHT and LEFT ARROW, respectively.'  // MISSING
		},

			{
			name: 'ម៉ីនុយបរិបទអ្នកកែសម្រួល',
			legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option with SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
		},

			{
			name: 'ប្រអប់បញ្ជីអ្នកកែសម្រួល',
			legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
		},

			{
			name: 'Editor Element Path Bar', // MISSING
			legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
		}
		]
	},
		{
		name: 'ពាក្យបញ្ជា',
		items: [
			{
			name: 'ការ​បញ្ជា​មិនធ្វើវិញ',
			legend: 'ចុច ${undo}'
		},
			{
			name: 'ការបញ្ជា​ធ្វើវិញ',
			legend: 'ចុច ${redo}'
		},
			{
			name: 'ការបញ្ជា​អក្សរ​ដិត',
			legend: 'ចុច ${bold}'
		},
			{
			name: 'ការបញ្ជា​អក្សរ​ទ្រេត',
			legend: 'ចុច ${italic}'
		},
			{
			name: 'ពាក្យបញ្ជា​បន្ទាត់​ពីក្រោម',
			legend: 'ចុច ${underline}'
		},
			{
			name: 'ពាក្យបញ្ជា​តំណ',
			legend: 'ចុច ${link}'
		},
			{
			name: ' Toolbar Collapse command', // MISSING
			legend: 'Press ${toolbarCollapse}' // MISSING
		},
			{
			name: ' Access previous focus space command', // MISSING
			legend: 'Press ${accessPreviousSpace} to access the closest unreachable focus space before the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.' // MISSING
		},
			{
			name: ' Access next focus space command', // MISSING
			legend: 'Press ${accessNextSpace} to access the closest unreachable focus space after the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.' // MISSING
		},
			{
			name: 'ជំនួយ​ពី​ភាព​ងាយស្រួល',
			legend: 'ជួយ ${a11yHelp}'
		},
			{
			name: ' Paste as plain text', // MISSING
			legend: 'Press ${pastetext}', // MISSING
			legendEdge: 'Press ${pastetext}, followed by ${paste}' // MISSING
		}
		]
	}
	],
	tab: 'Tab', // MISSING
	pause: 'ផ្អាក',
	capslock: 'Caps Lock', // MISSING
	escape: 'ចាកចេញ',
	pageUp: 'ទំព័រ​លើ',
	pageDown: 'ទំព័រ​ក្រោម',
	leftArrow: 'ព្រួញ​ឆ្វេង',
	upArrow: 'ព្រួញ​លើ',
	rightArrow: 'ព្រួញ​ស្ដាំ',
	downArrow: 'ព្រួញ​ក្រោម',
	insert: 'បញ្ចូល',
	leftWindowKey: 'Left Windows key', // MISSING
	rightWindowKey: 'Right Windows key', // MISSING
	selectKey: 'ជ្រើស​គ្រាប់​ចុច',
	numpad0: 'Numpad 0',
	numpad1: 'Numpad 1',
	numpad2: 'Numpad 2',
	numpad3: 'Numpad 3',
	numpad4: 'Numpad 4',
	numpad5: 'Numpad 5',
	numpad6: 'Numpad 6',
	numpad7: 'Numpad 7',
	numpad8: 'Numpad 8',
	numpad9: 'Numpad 9',
	multiply: 'គុណ',
	add: 'បន្ថែម',
	subtract: 'ដក',
	decimalPoint: 'ចំណុចទសភាគ',
	divide: 'ចែក',
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
	numLock: 'Num Lock', // MISSING
	scrollLock: 'បិទ​រំកិល',
	semiColon: 'ចុច​ក្បៀស',
	equalSign: 'សញ្ញា​អឺរ៉ូ',
	comma: 'ក្បៀស',
	dash: 'Dash', // MISSING
	period: 'ចុច',
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'តង្កៀប​បើក',
	backSlash: 'Backslash', // MISSING
	closeBracket: 'តង្កៀប​បិទ',
	singleQuote: 'បន្តក់​មួយ'
} );
