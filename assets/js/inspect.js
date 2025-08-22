(function() {
    var devtools = false;
    var threshold = 160;

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
            if (!devtools) {
                devtools = true;
                // alert("pleace close inspect element");
                // window.location.replace('about:blank');
                if (confirm("pleace close inspect element")) { 
                    window.location.replace('about:blank');
                }else{
                    window.location.replace('about:blank');
                }
            }
        } else {
            devtools = false;
        }
    }, 1000);
})();

document.addEventListener('contextmenu', event => event.preventDefault());

document.oncontextmenu=new Function("return false")
document.onkeydown = function(e){
    if (e.ctrlKey && 
       (e.keyCode === 67 || 
        e.keyCode === 73 ||
        e.keyCode === 74 || 
        e.keyCode === 85 || 
        e.keyCode === 117)) {
            return false;
        }
        if(e.keyCode === 123) {
            return false;
        } else {
            return true;
        }
};