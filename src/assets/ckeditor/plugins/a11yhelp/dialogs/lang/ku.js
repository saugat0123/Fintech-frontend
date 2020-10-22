/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'ku', {
	title: 'ڕێنمای لەبەردەستدابوون',
	contents: 'پێکهاتەی یارمەتی. کلیك ESC بۆ داخستنی ئەم دیالۆگه.',
	legend: [
		{
		name: 'گشتی',
		items: [
			{
			name: 'تووڵامرازی دەستكاریكەر',
			legend: 'کلیك ${toolbarFocus} بۆ ڕابەری تووڵامراز. بۆ گواستنەوەی پێشوو داهاتووی گرووپی تووڵامرازی داگرتنی کلیلی TAB لەگەڵ‌ SHIFT+TAB. بۆ گواستنەوەی پێشوو داهاتووی دووگمەی تووڵامرازی لەڕێی کلیلی تیری دەستی ڕاست یان کلیلی تیری دەستی چەپ. کلیکی کلیلی SPACE یان ENTER بۆ چالاککردنی دووگمەی تووڵامراز.'
		},

			{
			name: 'دیالۆگی دەستكاریكەر',
			legend:
				'لەناوەوەی دیالۆگ, کلیکی کلیلی TAB بۆ ڕابەری دیالۆگێکی تر, داگرتنی کلیلی SHIFT + TAB بۆ گواستنەوەی بۆ دیالۆگی پێشووتر, کلیكی کلیلی ENTER بۆ ڕازیکردنی دیالۆگەکە, کلیكی کلیلی ESC بۆ هەڵوەشاندنەوەی دیالۆگەکە. بۆ دیالۆگی بازدەری (تابی) زیاتر, کلیكی کلیلی ALT + F10 بۆ ڕابه‌ری لیستی بازده‌ره‌کان، یان کلیكی کلیلی TAB. بۆچوونه‌ بازده‌ری تابی پێشوو  یان دوواتر کلیلی تیری دەستی ڕاست یان چەپ بکە.' 
		},

			{
			name: 'پێڕستی سەرنووسەر',
			legend: 'کلیك ${contextMenu} یان دوگمەی لیسته‌(Menu) بۆ کردنەوەی لیستەی دەق. بۆ چوونە هەڵبژاردەیەکی تر له‌ لیسته‌ کلیکی کلیلی TAB یان کلیلی تیری ڕوو لەخوارەوه‌ بۆ چوون بۆ هەڵبژاردەی پێشوو کلیکی کلیلی SHIFT+TAB یان کلیلی تیری ڕوو له‌ سەرەوە. داگرتنی کلیلی SPACE یان ENTER بۆ هەڵبژاردنی هەڵبژاردەی لیسته‌. بۆ کردنەوەی لقی ژێر لیسته‌ لەهەڵبژاردەی لیستە کلیکی کلیلی SPACE یان ENTER یان کلیلی تیری دەستی ڕاست. بۆ گەڕانەوه بۆ سەرەوەی لیسته‌ کلیکی کلیلی ESC یان کلیلی تیری دەستی چەپ. بۆ داخستنی لیستە کلیكی کلیلی ESC بکە.'
		},

			{
			name: 'لیستی سنووقی سەرنووسەر',
			legend: 'لەناو سنوقی لیست, چۆن بۆ هەڵنبژاردەی لیستێکی تر کلیکی کلیلی TAB یان کلیلی تیری ڕوو لەخوار. چوون بۆ هەڵبژاردەی لیستی پێشوو کلیکی کلیلی SHIFT+TAB یان کلیلی تیری ڕوو لەسەرەوه‌. کلیکی کلیلی SPACE یان ENTER بۆ دیاریکردنی ‌هەڵبژاردەی لیست. کلیکی کلیلی ESC بۆ داخستنی سنوقی لیست.'
		},

			{
			name: 'تووڵامرازی توخم',
			legend: 'کلیك ${elementsPathFocus} بۆ ڕابەری تووڵامرازی توخمەکان. چوون بۆ دوگمەی توخمێکی تر کلیکی کلیلی TAB یان کلیلی تیری دەستی ڕاست. چوون بۆ دوگمەی توخمی پێشوو کلیلی SHIFT+TAB یان کلیکی کلیلی تیری دەستی چەپ. داگرتنی کلیلی SPACE یان ENTER بۆ دیاریکردنی توخمەکه‌ لەسەرنووسه.'
		}
		]
	},
		{
		name: 'فەرمانەکان',
		items: [
			{
			name: 'پووچکردنەوەی فەرمان',
			legend: 'کلیك ${undo}'
		},
			{
			name: 'هەڵگەڕانەوەی فەرمان',
			legend: 'کلیك ${redo}'
		},
			{
			name: 'فەرمانی دەقی قەڵەو',
			legend: 'کلیك ${bold}'
		},
			{
			name: 'فەرمانی دەقی لار',
			legend: 'کلیك ${italic}'
		},
			{
			name: 'فەرمانی ژێرهێڵ',
			legend: 'کلیك ${underline}'
		},
			{
			name: 'فەرمانی به‌ستەر',
			legend: 'کلیك ${link}'
		},
			{
			name: 'شاردەنەوەی تووڵامراز',
			legend: 'کلیك ${toolbarCollapse}'
		},
			{
			name: 'چوونەناو سەرنجدانی پێشوی فەرمانی بۆشایی',
			legend: 'کلیک ${accessPreviousSpace} to access the closest unreachable focus space before the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.'
		},
			{
			name: 'چوونەناو سەرنجدانی داهاتووی فەرمانی بۆشایی',
			legend: 'کلیک ${accessNextSpace} to access the closest unreachable focus space after the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.'
		},
			{
			name: 'دەستپێگەیشتنی یارمەتی',
			legend: 'کلیك ${a11yHelp}'
		},
			{
			name: 'لکاندنی وەك دەقی ڕوون',
			legend: 'کلیکی ${pastetext}',
			legendEdge: 'کلیکی ${pastetext}، شوێنکەوتکراوە بە ${paste}'
		}
		]
	}
	],
	tab: 'تاب',
	pause: 'پشوو',
	capslock: 'قفڵدانی پیتی گەورە',
	escape: 'چوونە دەرەوە',
	pageUp: 'پەڕە بەرەوسەر',
	pageDown: 'پەڕە بەرەوخوار',
	leftArrow: 'تیری دەستی چەپ',
	upArrow: 'تیری بەرەوسەر',
	rightArrow: 'تیری دەستی ڕاست',
	downArrow: 'تیری بەرەوخوار',
	insert: 'خستنە ناو',
	leftWindowKey: 'پەنجەرەی چەپ',
	rightWindowKey: 'پەنجەرەی ڕاست',
	selectKey: 'هەڵبژێرە',
	numpad0: 'Numpad 0', // MISSING
	numpad1: '1',
	numpad2: '2',
	numpad3: '3',
	numpad4: '4',
	numpad5: '5',
	numpad6: '6',
	numpad7: '7',
	numpad8: '8',
	numpad9: '9',
	multiply: '*',
	add: '+',
	subtract: '-',
	decimalPoint: '.',
	divide: '/',
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
	numLock: 'قفڵدانی ژمارە',
	scrollLock: 'قفڵدانی هێڵی هاتووچۆپێکردن',
	semiColon: ';',
	equalSign: '=',
	comma: ',',
	dash: '-',
	period: '.',
	forwardSlash: '/',
	graveAccent: '`',
	openBracket: '[',
	backSlash: '\\\\',
	closeBracket: '}',
	singleQuote: '\''
} );
