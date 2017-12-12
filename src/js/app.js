/*---------------------------------------
* Requires and variables
* ---------------------------------------*/

const request = require('request');
const electron = require('electron');
const shell = electron.shell;
const {ipcRenderer} = electron;
const { remote } = require('electron');
let win = remote.getCurrentWindow();

const imgUrlSmall = '<img src="https://files.coinmarketcap.com/static/img/coins/16x16/';
const imgUrlLarge = '<img src="https://files.coinmarketcap.com/static/img/coins/64x64/';
const imgUrlEnd = '.png">';
const oSlider = $('#oSlider');
let popList, searchContainer = [];
let rank, id, name, symbol, price, volume, mcap, perChange, per1h, check, selectedCoin, btcPrice, text;
let clickedValue = "bitcoin";
let currency = ' USD';

// minimize, close, refresh app
$('.fa-minus').on('click', function() {
    win.minimize();
});

$('.mClose').on('click', function() {
    win.close();
});

$('.fa-refresh').on('click', function() {
    win.reload();
});

// search on key up
$('#search-input').keyup(function() {
    searchList();
});

// show/hide .search list
$('#search-input').focus( function() {
    $('.search, .search-close').show();
    $('.main-container').css('height', '626px');
    $('#compact-btn').hide();

});

// clear search
$('.search-close').on('click', function() {
    clearSearch();  
});

// open about links in users default browser
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

// make API call
request('https://api.coinmarketcap.com/v1/ticker/?limit=1000', (error, response, body) => {
    if(!error && response.statusCode == 200) {
        popList = JSON.parse(body);
        populateData();
        mainInfo(popList);
        btcPrice = price;
        getListValue();
    } else {
       // alert(error + ". Please check connection and reset the app!");
    }
});

setInterval(() => {
    request('https://api.coinmarketcap.com/v1/ticker/' + clickedValue + '/', (error, response, body) => {
        if(!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body);
            mainInfo(body);
        } else {
            // display error
        }
    });
}, 180000); // upate main every 3min

// call funcs 
toggleOverlays('.toggle-overlay2', '.a2');
toggleOverlays('.toggle-overlay3', '.a3');
donate();
satoshiUSD();
opacity();

/*---------------------------------------
* Functions
* ---------------------------------------*/

// toggle settings/donation overlays
function toggleOverlays(overlay, aside) {
    $(overlay).on('click', function() {
        $('.search, .search-close').hide();
        $('.main-container').css('height', '200px');
        $(aside).toggleClass('open');
        $('.row-menu, .row1, .row2, .row3').toggleClass('hide-main');
        if(overlay === '.toggle-overlay2') {
            $('#convert-input, #convert-display').val("");
        }  
    });
}

// get clicked value from list and call refresh
function getListValue() {
    $(".search a").on("click", (el) => {
        clickedValue = $(el.target).text();
        console.log(clickedValue);
        // update 'clickedValue' with proper id
        let obj = searchArr(clickedValue, popList);
        clickedValue = obj.id;
        refreshMain();           
    });
}

// search coins based on clicked value and return coin obj
function searchArr(val, arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].name === val) {
            return arr[i];
        }
    }
}

// update main screen from list click
function refreshMain() {
    request('https://api.coinmarketcap.com/v1/ticker/' + clickedValue + '/', (error, response, body) => {
        if(!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body);
            mainInfo(body);
            $('.search, .search-close').hide();
            $('.main-container').css('height', '200px');
            clearSearch();
        } else {
            // display error
        }
    });
}

// pull info for main screen
function mainInfo(arr) {
    [name, id, symbol, price, rank, volume, mcap, perChange, per1h] = [
        arr[0]["name"], arr[0]["id"], arr[0]["symbol"], arr[0]["price_usd"],
        arr[0]["rank"], mFormat(arr[0]["24h_volume_usd"]), mFormat(arr[0]["market_cap_usd"]), 
        Math.sign(Number(arr[0]["percent_change_1h"])), arr[0]["percent_change_1h"]
    ];
    fillMain();
}

function mFormat(num) {
    if(Number(num) > 999999999) {
        return '$' + (num/1000000000).toFixed(2) + 'B';
    } else if(Number(num) > 999999) {
        return '$' + (num/1000000).toFixed(2) + 'M';
    } else if(Number(num) > 999) {
        return '$' + (num/1000).toFixed(2) + 'K';
    } else {
        return num;
    }
}

// fill main screen
function fillMain() {
    $('.coin-picture, .coin-name, .coin-rank, .coin-volume, .coin-mcap, .currency-small').fadeOut('fast', function() {
        $('.coin-picture').html(imgUrlLarge + id + imgUrlEnd).fadeIn('fast');
        $('.coin-name').html(name + ' ' + '(' + symbol + ')').fadeIn('fast');
        $('.coin-rank').html(rank).fadeIn('fast');
        $('.coin-mcap').html(mcap).fadeIn('fast');
        $('.coin-volume').html(volume).fadeIn('fast');
        $('.currency-small').text(currency).fadeIn('fast');  
    });
    fillPricePercent(1, '#25DAA5');
    fillPricePercent(-1, 'rgb(245, 56, 103)'); 
    fillPricePercent(0, 'rgba(255, 255, 255, 0.75)');
    console.log(perChange);
}

// check 1h percent change and fill info/change color
function fillPricePercent(change, color) {
    if(perChange === change) {
        $('.coin-price, .percent-change, .percent-time').fadeOut('fast', function() {
            $('.coin-price').text('$' + price).fadeIn('fast');
            $('.percent-change').text('(' + per1h + '%)').fadeIn('fast');
            $('.percent-time').text('1hr').fadeIn('fast');
            $('.coin-price, .percent-change').css('color', color);
        });     
    }   
}

// populate search list
function populateData() {
    for(var i = 0; i < popList.length; i++) {
        rank = popList[i]["rank"];
        id = popList[i]["id"];
        name = popList[i]["name"];
        symbol = popList[i]["symbol"];
        generateDiv();
    }
}

// generate div for search list
function generateDiv() {
    $('.search-table').append('<tr id="row"><td class="list-rank">' + rank + '</td><td class="list-image">' + imgUrlSmall + id + imgUrlEnd + '</td><td class="listDiv"><a href="#">' + 
    name + '</a> (' + symbol + ')</td></tr>');
}

// filter search 
function searchList() {
    var search = $('#search-input').val().toUpperCase();
    $('.search #row').each(function() {
        text = $(this).text().toUpperCase();
        if(text.indexOf(search) > -1 || search == "") {
            $(this).css("display", "table-row");
        } else {
            $(this).css("display", "none");
        }
    });   
}

// convert satoshi to usd
function satoshiUSD() {
    $('#convert-input').bind('input', function() {
        x = $('#convert-input').val().toString().replace(/\,/g,'');
        if(x >= 1000) {
            y = x.toString().split(".");
            y[0] = y[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            z = y.join('.');
            $('#convert-input').val(y);
        }
        if(isNaN(x * 2)) {
            $('#convert-display').val(0);
            console.log('nan error');
        } else {
            $.get("http://api.coindesk.com/v1/bpi/currentprice.json", function(data) {
                var body = JSON.parse(data);
                var btcPrice = body.bpi.USD.rate.replace(/\,/g,'') * x;
                var satUSD = (btcPrice * 0.00000001);
                a = (satUSD).toFixed(8);
                b = a.toString().split(".");
                b[0] = b[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                c = b.join('.');
                $('#convert-display').val(c);
            });
        }
    });
}

// opacity slider
function opacity() {
    oSlider.on('input', function() {
        $('.main-container, .a1, .a2, .a3').css("background", "rgba(67, 77, 90, " + $(this).val() + ")");
        // $('.menu').css("box-shadow", "-1px 1px 3px rgba(43, 50, 58, " + $(this).val() + ")");
        $('.menu').css("background", "rgba(38, 44, 51, " + $(this).val() + ")");
    });
}

// donate info
function donate() {
    $('.donate-list').change(function() {
        let value = $(this).val();
        if(value === "btc") {
            $('.qrcode').attr('src', 'src/img/btc-qr.png');
            $('.donate-address span').text('15As8L4n1Z2oyw9UfsTpfC4KR9Q7h8eUNL');
        } else if(value === "eth") {
            $('.qrcode').attr('src', 'src/img/eth-qr.png');
            $('.donate-address span').text('0x015f4ca16753e7De0d042dc4E0E06F8b09585834');
        } else if(value === "ltc") {
            $('.qrcode').attr('src', 'src/img/ltc-qr.png');
            $('.donate-address span').text('LbpJYgkeAme2ca2pGFuP1dF8AioSKKErTG');
        }
    });
}



// clear #search-input val
function clearSearch() {
    $('#search-input').val("");
    $('.search #row').each(function() {
        $(this).css("display", "table-row");
     });
     $('.search, .search-close').hide();
     $('.fa-compress').show();
     $('.main-container').css('height', '200px');
}