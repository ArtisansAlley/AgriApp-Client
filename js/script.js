$(document).ready(function() {
    set_up_cam();

    $camera_contents = $('#camera-slide .contents');
    $loading = $('#loading');
    $result = $('#result');
    $topThree = $('#top-three');

    server_resp = undefined;

    Webcam.on( 'live', function() {  
        swiper.slideNext(500);  
    });

    const swiper = new Swiper('.swiper-container', {
        effect: 'cube',
        allowTouchMove: false,
    });

    swiper.on('slideChange', function(swiper) {
        $navbar = $('#navbar');
        console.log(swiper);
        switch(swiper.activeIndex) {
            case 1:
                $camera_contents.show();
                Webcam.unfreeze();
                $navbar.hide();
                break;
            case 2:
                $result = $('#result');
                $result.find('.description').addClass('animate__bounceInUp');
                $navbar.show();
                break;
            case 3:
                $result = $('#more-info');
                $result.find('.prevention, .control').addClass('animate__bounceInUp');
                break;
            default:
                $navbar.hide();
        }
    })

    $('#learn-more').click(function() {
        swiper.slideNext(500);
    })
    
    $('#back-slide').click(function() {
        swiper.slidePrev(500);
        $('body').find('.animate__bounceInUp').removeClass('animate__bounceInUp');
    })


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
                url: 'https://49.150.136.198:8080/upload',
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
                    console.log(res);
                    server_resp = res.message;
                    
                    // if (server_resp.veggies_predictions[0] === 'spinach') {
                    //     displayDiseases(server_resp.diseases.topThree[0]);
                    // } else {
                    //     console.log('not a spinach');
                    // }
                    displayDiseases(server_resp.diseases.topThree[0], server_resp.diseases.top_result_confidence);
                    swiper.slideNext(500);
                },
                complete: function() {
                    $loading.fadeOut(100);
                }
            });
        });
    });
});

function displayDiseases(disease, confidence) {
    var diseases = {
        'Alternaria Leaf Spot': {
            'img': 'img/diseases/leaf-spot.jpg',
            'description': 'Alternaria leaf spot is caused by fungus Alternaria brassicae. The leaves of the infected crop (especially kales) have black or brown circular spots. With time, the spots enlarge and concentric rings appear on them.',
            'prevention': 'You can prevent this disease by planting certified seed or disease-free transplants. You can also prevent it by avoiding wet and warm conditions in your garden as the fungus is very active under these conditions. Cruciferae weeds harbor the fungus, so you should eradicate them from your garden.',
            'control': 'The best way to control Alternaria leaf spot is to uproot and bury or burn the infected crop. You can also spray your crops with a suitable fungicide immediately after you see the symptoms.'
        },
        'Anthracnose': {
            'img': 'img/diseases/anthracnose.jpg',
            'description': 'Caused by fungus Colletotrichum higginisianum, Anthracnose affects leaves & stems of vegetables like turnips, and causes small, gray, or black spots on these parts.',
            'prevention': 'The harmful microorganism survives in weeds, so you can prevent it by removing any unwanted plants from your garden. You can also prevent the fungus by keeping your garden at a lower moisture level.',
            'control': 'The affected crops can spread Anthracnose to the healthy ones, so you need to remove the infected crops from your garden in order to control the spread of the disease. You can try suitable fungicides to kill the pathogen.'
        },
        'Downy Mildew': {
            'img': 'img/diseases/downey-mildew.jpg',
            'description': 'Caused by fungus Colletotrichum higginisianum, Anthracnose affects leaves & stems of vegetables like turnips, and causes small, gray, or black spots on these parts.',
            'prevention': 'The harmful microorganism survives in weeds, so you can prevent it by removing any unwanted plants from your garden. You can also prevent the fungus by keeping your garden at a lower moisture level.',
            'control': 'The best way to control Alternaria leaf spot is to uproot and bury or burn the infected crop. You can also spray your crops with a suitable fungicide immediately after you see the symptoms.'
        }
    }

    disease_info = diseases[disease];
    
    $('#result').find('.disease-name').text(disease);
    $('#result').find('.confidence').text(confidence);
    $('#result').find('.description-text').text(disease_info.description);
    $('#result').find('.preview-screen').css('background-image', 'url(' + disease_info.img + ')');

    $('#more-info').find('.prevention-text').text(disease_info.prevention);
    $('#more-info').find('.control-text').text(disease_info.description);
}

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
