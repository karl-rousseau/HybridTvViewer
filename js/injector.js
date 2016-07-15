function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        element.className += ' ' + className;
    }
}

function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
}

// If the extension is not activated for this web page then we do nothing and
// wait for the user to click on the extension icon ...
var pageActivated = localStorage.getItem('tvViewer_active') == 'true';
if (pageActivated) {

    // Just tag current page as activated and also do CSS injection at the same time ...
    addClass(document.documentElement, "tvViewer");

}
