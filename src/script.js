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

    if (res['Status'] === 0) {
        let root_element_address = document.getElementById('doge-address');

        let address_info = document.createElement('p');
        if (res['AD'] === false) {
            // add warning because DNSSEC is not enabled on the domain
            let element_address_warning = document.getElementById('address-warning');
            let text_address_warn_dnssec = document.createTextNode('DNSSEC is not enabled on this domain address can have been modified, please double check before sending fund on it');
            element_address_warning.appendChild(text_address_warn_dnssec);
        }
        let text_address_info = document.createTextNode('Address found for this website\n ' + address);
        address_info.appendChild(text_address_info);
        root_element_address.appendChild(text_address_info);

    } else {
        document.getElementById('doge-address').innerHTML = "This website don't have a doge address linked";
    }

}

fetchData();

