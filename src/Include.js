
/**
*   NOTE: file have been require in here can not require this file
*/
import ScrollView from './components/elements/CustomScrollView'
import TextInput from './components/elements/CustomTextInput'

const Include = {
    Image:require('./components/elements/CustomImage'),
    Text:require('./components/elements/CustomText'),
    ScrollView,
    TextInput
}

module.exports = Include;
