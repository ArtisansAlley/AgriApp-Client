function displayTopThree(topThree, type) {
    html = '';
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
            'img': 'img/veggies/malunggay.jpeg',
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

    var diseases = {
        'Alternaria Leaf Spot': {
            'img': 'img/diseases/Alternaria Leaf Spot.png',
            'description': 'Downy mildew is a fungal disease caused by Peronospora parasitica. It causes white mold and faint yellow spots on the dorsal and ventral sides of the leaves respectively.',
            'prevention': 'Caused by fungus Colletotrichum higginisianum, Anthracnose affects leaves & stems of vegetables like turnips, and causes small, gray, or black spots on these parts.'
        },
        'Anthracnose': {
            'img': 'img/diseases/Anthracnose.jpg',
            'description': 'Alternaria leaf spot is caused by fungus Alternaria brassicae. The leaves of the infected crop (especially kales) have black or brown circular spots. With time, the spots enlarge and concentric rings appear on them.'
        },
        'Downy Mildew': {
            'img': 'img/diseases/Downy Mildew.png',
            'description': 'Caused by fungus Colletotrichum higginisianum, Anthracnose affects leaves & stems of vegetables like turnips, and causes small, gray, or black spots on these parts.'
        }
    }

    var data = {
        'veggies': veggies,
        'diseases': diseases
    }

    for (i = 0; i < topThree.length; i++) {
        veg = topThree[i];
        
        html +=  `
        <div class="list-group-item ${veg}">
            <div class="row">
                <div class="col-4">
                    <div class="veggie-preview" style="background-image: url('${data[type][veg].img}');"></div>
                </div>
                <div class="col-8">
                    <h5>${veg} <span class="badge badge-primary">${i + 1}</span></h5>
                    <em class="text-secondary">Scientific Name : ${data[type][veg].scientific_name}</em>
                </div>
            </div>
        </div>
        `;
    }
    return html;
}
function set_up_cam() {
    res = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    Webcam.set('constraints', {
            video: true,
            facingMode: "environment"
    });

    Webcam.set({
        width: res.width,
        height: res.height,
        image_format: 'png',
        jpeg_quality: 100
    })

    Webcam.attach('#camera');
}

$(document).ready(function() {
    set_up_cam();

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

    $camera_contents = $('#camera-wrapper .contents');
    $loading = $('#loading');
    $result = $('#result');
    $topThree = $('#top-three');

    server_resp = undefined;

    Webcam.on( 'live', function() {    
        setTimeout(function() {
            $('#welcome').fadeOut();
            $('#camera-wrapper').show();
        }, 1000)
    });

    $('#back').click(function() {
        $loading.hide();
        $result.fadeOut();
        $camera_contents.show();
        Webcam.unfreeze();
    })

    $('#capture').click(function() {
        $check = $('.fa-camera');
        $spin = $('.fa-spin');
        Webcam.snap( function(data_uri) {
            Webcam.freeze();
            $camera_contents.hide(100);

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
                    $loading.fadeIn(100);
                },
                error: function(res) {
                },
                success:function(res) {
                    alert(JSON.stringify(res));
                    server_resp = res.message;
                    topThree = server_resp.veggies_predictions;
                    html = '';
                    html = displayTopThree(topThree, 'veggies');
                    
                    $result.find('.preview-image').css('background-image', 'url(' + data_uri + ')')
                    $result.find('.title').text('Top Three Identifications');
                    $result.fadeIn(100);
                    $topThree.html(html);
                },
                complete: function() {
                    $loading.fadeOut(100);
                }
            });
        });

        $result.on('click', '.spinach', function() {
            html = displayTopThree(server_resp.diseases.topThree, 'diseases');
            $result.find('.title').text('Top Three Diseases');
            $topThree.html(html);
        });
    });
})
