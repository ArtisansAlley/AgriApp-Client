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
    $check = $('.fa-check');
    $spin = $('.fa-spin');


    Webcam.snap( function(data_uri) {
        data = {'img': data_uri};
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.100.31:5010/upload',
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
                    <div class="card mb-2">
                        <img class="card-img-top" src="${veggies[veg].img}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="font-weight-bold">${veg.charAt(0).toUpperCase() + veg.slice(1)}</h5>
                            <p><em>${veggies[topThree[i]].scientific_name}</em></p>
                        </div>
                    </div>     
                    `;
                }

                $('#result .modal-body').html(html);
                $('#result').fadeIn();
            },
            complete: function() {
                $check.show();
                $spin.hide();
            }
        })
    });
}   

$('#result .close').click(function() {
    $('#result').fadeOut()
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