var width = $(window).width();
var height =  $(window).height();

var veggies = {
    'cabbage': {
        'img': 'img/veggies/cabbage.jpeg',
        'scientific_name': 'Brassica oleracea var. capitata'
    },
    'lettuce': {
        'img': 'img/veggies/lettuce.jpeg',
        'scientific_name': 'Lactuca sativa'
    },
    'pechay': {
        'img': 'img/veggies/petchay.jpeg',
        'scientific_name': 'Brassica rapa'
    },
    'malunggay': {
        'img': 'img/veggies/lettuce.jpeg',
        'scientific_name': 'Moringa oleifer'
    },
    'parsley': {
        'img': 'img/veggies/parlsey.jpeg',
        'scientific_name': 'Petroselinum crispum'
    },
    'spinach': {
        'img': 'img/veggies/spinach.jpeg',
        'scientific_name': 'Spinacia oleracea'
    }
}

function compute_aspect_ratio() {
    original_width = 1080;
    original_height = 1920;
    new_width = window.innerWidth;
    new_height = original_height / original_width * new_width;

    return {
        w:new_width,
        h:new_height
    };
}

function set_up_cam() {
    res = compute_aspect_ratio();

    Webcam.set('constraints', {
            video: true,
            facingMode: "environment"
    });
    Webcam.set({
        width: res.w,
        height: res.h,
        image_format: 'png',
        jpeg_quality: 100
    })

    Webcam.attach('#camera');
}


Webcam.on( 'live', function() {    
    setTimeout(function() {
        $('#welcome').fadeOut();
        $('#capture').show();
    }, 1000)
} );

// /http://manifestocrafters.mine.bz:8080/upload
function take_snapshot() {
    $check = $('.fa-camera');
    $spin = $('.fa-spin');

   
    Webcam.snap( function(data_uri) {
        data = {'img': data_uri};
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.100.31:5010/upload',
            // url: 'http://manifestocrafters.mine.bz:8080/upload',
            method: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: data,
            beforeSend: function() {
                $check.hide();
                $spin.show();
            },
            error: function(res) {
                alert(JSON.stringify(res));
            },
            success:function(res) {
                topThree = res.message;
                html = '';

                for (i = 0; i < topThree.length; i++) {
                    veg = topThree[i];
                    html +=  `
                    <div class="card mb-3">
                    <div class="card-body">
                        <div class="top p-3">
                            <h5 class="font-weight-bold text-light mb-0">${i}</h5>
                        </div>
                        <div class="veggie-image"></div>
                        <h5 class="font-weight-bold">${topThree[i]}</h5>
                        <p><em>Brassica oleracea var. capitata</em></p>
                    </div>
                </div>	
                    `;
                }

                $('#content').html(html);
                $("html, body").animate({ scrollTop: 0 }, "slow");
                $('#result #preview').css({backgroundImage:'url(' + data_uri + ')'});
                // $('#result').fadeIn(0);

                var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');
                var imageObj = new Image();

                imageObj.onload = function() {
                // draw cropped image
                var sourceX = 360/2;
                var sourceY = (640/2)-244;
                var sourceWidth = 244;
                var sourceHeight = 244;
                var destWidth = sourceWidth;
                var destHeight = sourceHeight;
                var destX = canvas.width / 2 - destWidth / 2;
                var destY = canvas.height / 2 - destHeight / 2;

                context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                };
                imageObj.src = data_uri;

            },
            complete: function() {
                $check.show();
                $spin.hide();
            }
        })
    });
}   


$('#result #back').click(function() {
    $('#result').fadeOut(0)
})

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