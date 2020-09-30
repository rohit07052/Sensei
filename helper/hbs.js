const moment = require('moment') //used for formatting / parsing

module.exports = {
    //formates date using moment
    formatDate: function(date, format) {
        return moment(date).format(format)
    },
    //for displaying the experiences in cards we truncate the max words as
    //irregularity is words will result in irregular sizes of the cards which is not good for alignment
    truncate: function(str, len) { //takes the string and the size upto which we want to truncate the string as argument
        if (str.length > len && str.length > 0) {
            let new_str = str + ' ' //adding a space at the end
            new_str = str.substr(0, len) //now getting the size of string we want
            new_str = str.substr(0, new_str.lastIndexOf(' ')) // making sure that we don't slice a word 
            new_str = new_str.length > 0 ? new_str : str.substr(0, len) // if we don't include any string at all
            return new_str + '...'
        }
        return str
    },
    //in wyswyg editors you will also get the tags and change lines but we don't want to display them
    //so we select all the tags and change lines and replace them with black (we delete them)
    //we do this using regex
    stripTags: function(input) {
        return input.replace(/(<(?:.|\n)*?>|&nbsp;)/gm, '') //this regex selects everything which starts with < and ends with >

        //we can also use the regex  /<[^>]*>/gm this will do the same
    },

    //this function checks if the user who is logged in is the same user who has written the story 
    // if they are both same then an option for editing the experience is rendered
    editIcon: function(storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/experiences/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/experiences/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    },


}