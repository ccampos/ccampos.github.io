(() => {
    const getData = (state_association_key) => {
        const endpoint = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=${state_association_key}&size=50`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const setSelectEventListener = () => {
        $('#state-association-select').change((event) => {
            const value = $('#state-association-select').val();
            console.log(value);
            getData(value);
        });
    }

    const init = () => {
        setSelectEventListener();
    }

    $(init);
})();