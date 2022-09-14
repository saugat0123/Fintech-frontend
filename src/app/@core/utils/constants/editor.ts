export class Editor {
    static CK_CONFIG = {
        allowedContent: false,
        contentsCss: ['body {font-size: 18px;font-family:Cambria;}'],
        font_names: 'Arial;Times New Roman;Verdana;Cambria',
        toolbarGroups: [
            {name: 'document', groups: ['mode', 'document', 'doctools']},
            {name: 'clipboard', groups: ['clipboard', 'undo']},
            {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
            {name: 'forms', groups: ['forms']},
            '/',
            {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
            {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
            {name: 'links', groups: ['links']},
            {name: 'insert', groups: ['insert']},
            '/',
            {name: 'styles', groups: ['styles']},
            {name: 'colors', groups: ['colors']},
            {name: 'tools', groups: ['tools']},
            {name: 'others', groups: ['others']},
            {name: 'about', groups: ['about']}
        ],
        removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,About',
        extraPlugins: 'colordialog,tableresize',
    };
}
