async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function fetchData() {
    let tab = await getCurrentTab();
    let domain = (new URL(tab.url));
    domain = domain.hostname;
    console.log("Get doge address for " + domain);

    var header = new Headers();
    header.append("Accept", "application/dns-json");
    let response = await fetch('https://cloudflare-dns.com/dns-query?type=TXT&name=' + domain, {
        mode: 'cors',
        headers: header,
        method: 'GET'
    });
    let res = await response.json();
    console.log(res)

    document.getElementById('domain').innerHTML = domain;

    let item = res['Answer'].filter(function (value, index, array) {
        return value['data'].includes("dogecoin");
    });
    let address = item[0]['data'].split(':')[1].replace('"', '');
    var GenerateQRCode, htmlEncode;
            htmlEncode = function(value) {
            return $('<div/>').text(value).html();
    };
    if (res['Status'] === 0) {
        let root_element_address = document.getElementById('doge-address');

        let address_info = document.createElement('p');
        if (res['AD'] === false) {
            // add warning because DNSSEC is not enabled on the domain
            let element_address_warning = document.getElementById('address-warning');
            element_address_warning.innerHTML = "<p style='font-size:10px;padding:10px;'><i class='fa fa-info-circle' style='color:red;'></i> DNSSEC is not enabled on this domain address can have been modified, please double check before sending fund on it</p>";
        }
        root_element_address.innerHTML = '<center>Address found for this website ' + '<br/>' + address + '</center>';
        document.getElementById("tpqr").innerHTML = "<div style=''><center><img id='st' height='100' width='100'></center><center><span style='font-size:12px;'>Scan this QR Code to send dogecoin.</span></center></div>";
        document.getElementById("st").src = 'https://chart.googleapis.com/chart?cht=qr&chl=' + htmlEncode('dogecoin:'+address) + '&chs=500x500&chld=L|0';
        address_info.appendChild(text_address_info);

    } else {
        document.getElementById('doge-address').innerHTML = "This website don't have a doge address linked";
    }

}

fetchData();

