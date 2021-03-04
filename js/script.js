var width = $(window).width();
var height =  $(window).height();


function set_up_cam() {
    Webcam.set('constraints', {
            video: true,
            facingMode: "environment"
    });

    Webcam.attach('#camera');
}

Webcam.on( 'live', function() {    
    setTimeout(function() {
        $('#welcome').fadeOut();
        $('#capture').show();
    }, 1000)
} );

// /http://manifestocrafters.mine.bz/upload
function take_snapshot() {
    Webcam.freeze()
    Webcam.snap( function(data_uri) {
        data = {'img': data_uri};
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.100.31:5010/upload',
            method: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: data,
            error: function(res) {
                alert(JSON.stringify(res));
            },
            success:function(res) {
                topThree = res.message;
                html = '';

                for (i = 0; i < topThree.length; i++) {
                    html +=  `
                    <div class="row">
                        <div class="col-4">	
                            <img class="img-fluid" src="img/veggies/${topThree[i]}.png" alt="">
                        </div>
                        <div class="col-8">
                            <p class="h5">${i + 1}. ${topThree[i]}</p>
                        </div>
                    </div>
                    `;
                }

                $('#result .modal-body').html(html);
                $('#result').modal('show');
            }
        })
    });
}   

$(document).ready(function() {
    set_up_cam();
})

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