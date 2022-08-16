import {Inputs} from './inputs';

export class FormType {
    static ADDRESS = 'address';
    static DATE = 'date';
    static SELECT = 'dropdown';
    static TEXT = 'text';
    static TEXTAREA = 'textarea';
    static RADIO = 'radio';
    static BREAK = 'break';
    static CHECKBOX = 'checkbox';
    static FORM_ARRAY = 'formArray';
    static BUTTON = 'button';


    static COLSPAN = [{
        'id': '1',
        'value': 'col-md-3',
    }, {
        'id': '2',
        'value': 'col-md-4',
    }, {
        'id': '3',
        'value': 'col-md-6',
    }, {
        'id': '4',
        'value': 'col-md-12',
    }];

    static FONT_SIZE = [
        {
            'id': '1',
            'value': 'sb-small',
        }, {
            'id': '2',
            'value': 'sb-middle',
        }];

    static INPUT_TYPE = [
        {
            'id': 'Any',
            'value': '1',
            'type': 'text',
        }, {
            'id': 'Email',
            'value': '2',
            'type': 'Email',
        }, {
            'id': 'Alphabet',
            'value': '3',
            'type': 'text',
        }, {
            'id': 'Alpha Numeric',
            'value': '4',
            'type': 'text',
        },
        {
            'id': 'Numeric',
            'value': '5',
            'type': 'number',
        }];

    static DISPLAY = [
        {
            'id': 'inline',
            'value': 'd-inline-flex',
        },
        {
            'id': 'row',
            'value': 'flex-row',
        },
    ];

    static BUTTON_TYPE = [
        {
            'id': 'Submit',
            'value': '1',
            'type': 'Submit',
        }, {
            'id': 'Next',
            'value': '2',
            'type': 'Next',
        }];
    static BUTTON_POSITION = [
        {
            'id': 'Left',
            'value': 'float-left',
            'type': 'float-left',
        }, {
            'id': 'Right',
            'value': 'float-right',
            'type': 'float-right',
        },
        {
            'id': 'Center',
            'value': 'd-flex justify-content-center',
            'type': 'd-flex justify-content-center',
        }
        ];

    INPUT_TEXT = {
        'name': 'Text',
        'type': FormType.TEXT,
        'colspan': 'col-md-12',
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
            'type': 'text'
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',
            'type': 'text'
        }, {
            'name': 'Column Span',
            'value': 'col-md-3',
            'type': 'dropdown',
            'possibleValues': FormType.COLSPAN,
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'Required',
            'value': false
        }, {
            'name': 'Max Input Length',
            'value': '50',
            'type': 'text'
        }, {
            'name': 'Input Type',
            'value': '1',
            'type': 'dropdown',
            'possibleValues': FormType.INPUT_TYPE,
        }
        ],
        'condition': [{
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_DATE = {
        'name': 'Date',
        'type': FormType.DATE,
        'colspan': 'col-md-12',
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
            'type': 'text'
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',
            'type': 'text'
        }, {
            'name': 'Column Span',
            'value': 'col-md-3',
            'type': 'dropdown',
            'possibleValues': FormType.COLSPAN,
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'Required',
            'value': false
        },

        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_SELECT = {
        'name': 'Selection',
        'type': FormType.SELECT,
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
            'type': 'text'
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',
            'type': 'text'
        }, {
            'name': 'Column Span',
            'value': 'col-md-3',
            'type': 'dropdown',
            'possibleValues': FormType.COLSPAN,
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'Required',
            'value': false
        }, {
            'name': 'Enable Multi select',
            'type': 'multiple',
            'key': 'multiple',
            'value': false
        },
            {
                'name': 'Choice',
                'type': 'dropdown_increment',
                'possibleValue': [
                    {
                        'Text': 'Choice 1',

                    }
                    , {
                        'Text': 'Choice 2'
                    }
                ]
            },


        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false

        }]
    };

    INPUT_TEXTAREA = {
        'name': 'Paragraph',
        'type': FormType.TEXTAREA,
        'settings': [{
            'name': 'Field Label',
            'value': 'Paragraph',
            'type': 'text'
        },
            {
                'name': 'Placeholder',
                'value': 'placeholder',
                'type': 'text'
            }, {
                'name': 'Column Span',
                'value': 'col-md-3',
                'type': 'dropdown',
                'possibleValues': FormType.COLSPAN
            }, {
                'name': 'General options',
                'type': 'checkBoxZone',
                'key': 'Required',
                'value': false
            },
            {
                'name': 'Enable Rich Text',
                'type': 'ckEditor',
                'key': 'ckEditor',
                'value': false
            },
            {
                'name': 'Row',
                'key': 'rows',
                'value': '4',
                'type': 'number'
            },

        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_LINEBREAK = {
        'name': 'Line Break',
        'type': FormType.BREAK,
        'settings': [{
            'name': 'Field Label',
            'value': 'Header',
            'type': 'text'
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'show Line',
            'value': true
        },
            {
                'name': 'Column Span',
                'value': 'col-md-12',
                'possibleValues': FormType.COLSPAN
            }, {
                'name': 'Font',
                'value': 'sb-middle',
                'type': 'dropdown',
                'possibleValues': FormType.FONT_SIZE
            }],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_ADDRESS = {
        'name': 'Address',
        'type': FormType.ADDRESS,
        'colspan': 'col-md-12',
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',

        }, {
            'name': 'Column Span',
            'value': 'col-md-12',
            'possibleValues': FormType.COLSPAN,
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'Required',
            'value': false
        },

        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_RADIO = {
        'name': 'Radio',
        'type': FormType.RADIO,
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
            'type': 'text'
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',

        }, {
            'name': 'Column Span',
            'value': 'col-md-3',
            'type': 'dropdown',
            'possibleValues': FormType.COLSPAN,
        }, {
            'name': 'General options',
            'type': 'checkBoxZone',
            'key': 'Required',
            'value': false
        }, {
            'name': 'Display',
            'value': 'd-inline-flex',
            'type': 'dropdown',
            'possibleValues': FormType.DISPLAY,
        },
            {
                'name': 'Choice',
                'type': 'dropdown_increment',
                'possibleValue': [
                    {
                        'Text': 'Choice 1',

                    }
                    , {
                        'Text': 'Choice 2'
                    }
                ]
            },


        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

    INPUT_CHECKBOX = {
        'name': 'Check Box',
        'type': FormType.CHECKBOX,
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Text',
            'type': 'text'
        }, {
            'name': 'Placeholder',
            'value': 'placeholder',
        }, {
            'name': 'Column Span',
            'value': 'col-md-3',
            'type': 'dropdown',
            'possibleValues': FormType.COLSPAN,
        },

        ]
    };

    INPUT_ARRAY = {
        'name': 'Form Array',
        'type': FormType.FORM_ARRAY,
        'fields': [],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]

    };

    INPUT_BUTTON = {
        'name': 'Button',
        'type': FormType.BUTTON,
        'colspan': 'col-md-12',
        'settings': [{
            'name': 'Field Label',
            'value': 'Single Button',
            'type': 'text'
        }, {
            'name': 'Button Type',
            'value': '1',
            'type': 'dropdown',
            'possibleValues': FormType.BUTTON_TYPE,
        }, {
            'name': 'Button Position',
            'value': 'float-left',
            'type': 'dropdown',
            'possibleValues': FormType.BUTTON_POSITION,
        },
            {
                'name': 'General options',
                'type': 'checkBoxZone',
                'key': 'Required',
                'value': false
            },
        ],
        'condition': [ {
            'name': 'Radio Checked',
            'value': '',
            'radioId': '',
            'type': 'radioCheck',
            'checked': false
        }]
    };

}
