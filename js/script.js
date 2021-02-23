var width = $(window).width();
var height =  $(window).height();


function set_up_cam() {
    
    Webcam.set('constraints', {
            video: true,
            facingMode: "environment"
    });
    
    Webcam.set({
        image_format: 'jpeg',
        jpeg_quality: 100
    });

    Webcam.attach('#camera');
}

Webcam.on( 'live', function() {    
    setTimeout(function() {
        $('#welcome').fadeOut();
        $('#capture').show();
    }, 1000)
} );

function take_snapshot() {
    Webcam.freeze()
    Webcam.snap( function(data_uri) {
        data = {'img': data_uri};
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://manifestocrafters.mine.bz/upload',
            method: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: data,
            complete:function(res) {
                alert(res.responseJSON.message);
            },
            error:function(res){
                alert(JSON.stringify(res));
            }
        })
    });
}
document.addEventListener('deviceready', () => {
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.CAMERA, success, error);
    function error() {
        alert('Camera permission is not turned on');
      }
       
      function success( status ) {
        set_up_cam();
        if( !status.hasPermission ) error();
      }
});