(() => {
    const displayResults = (results) => {
        let templateString = "",
            key,
            level,
            participants,
            start_time,
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < results.length; i++) {
            key = results[i].key ? results[i].key : 'Key Not Found';
            level = results[i].level ? results[i].level : 'Headline Not Found';
            participants = results[i].participants ? results[i].participants : [{ name: 'Not Found' }, { name: 'Not Found' }];
            participants[0] = results[i].participants[0] ? results[i].participants[0] : { name: 'Not Found' };
            participants[1] = results[i].participants[1] ? results[i].participants[1] : { name: 'Not Found' };
            participants[0].name = results[i].participants[0].name ? results[i].participants[0].name : 'Not Found';
            participants[1].name = results[i].participants[1].name ? results[i].participants[1].name : 'Not Found';
            start_time = results[i].start_time ? results[i].start_time : '2001-01-01T00:00:00.000Z';
            start_time = new Date(results[i].start_time);

            templateString += `
                <tr>
                    <td>${key}</td>
                    <td class="headline">${level}</td>
                    ${participants[0].name ?
                        `<td>${participants[0].name}` : 'Not Found'}
                        <br>
                        vs.
                        <br>
                    ${participants[1].name ?
                        `${participants[1].name}` : 'Not Found'}</td>
                    <td>${months[start_time.getMonth()]}
                    ${start_time.getDate()}
                    ${start_time.getFullYear()}
                    ${start_time.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:${start_time.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</td>
                </tr>
            `;
        }
        $('#results table tbody').html(templateString);
        $('#results table').css('display', 'table');
    }

    const getData = (values_obj) => {
        let endpoint;
        if (values_obj.state_association_key && values_obj.start_date == "Invalid Date" && values_obj.end_date == "Invalid Date") {
            endpoint = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=${values_obj.state_association_key}&size=50`;
        } else if (values_obj.end_date <= values_obj.start_date) {
            $('#application_message').text('Start Date should be before End Date');
            return;
        } else if (values_obj.start_date != "Invalid Date" && values_obj.end_date != "Invalid Date") {
            endpoint = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=${values_obj.state_association_key}&size=50&from=${values_obj.start_date}&to=${values_obj.end_date}`;
        } else if (values_obj.start_date == "Invalid Date" || values_obj.end_date == "Invalid Date") {
            $('#application_message').text('Please enter both Start and End Date');
            return;
        } else {
            endpoint = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=${values_obj.state_association_key}&size=50`;
        }

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.items.length != 0) {
                    displayResults(data.items)
                } else {
                    $('#application_message').text('No Results, please try different criteria');
                    return;
                }
            })
            .catch(error => console.log(error));
    }

    const getValues = () => {
        let startDate = new Date($('#start_date').val()),
            endDate = new Date($('#end_date').val());

        if (startDate != "Invalid Date") {
            startDate = startDate.toISOString();
        }
        if (endDate != "Invalid Date") {
            endDate = endDate.toISOString();
        }

        return {
            state_association_key: $('#state-association-select').val(),
            start_date: startDate,
            end_date: endDate
        }
    }

    const clearApplicationMessage = () => {
        $('#application_message').text('');
    }

    const hideResultsTable = () => {
        $('#results table').css('display', 'none');
    }

    const setEventListeners = () => {
        $('#state-association-select').change((event) => {
            const values_obj = getValues();
            console.log(values_obj);
            clearApplicationMessage();
            hideResultsTable();
            getData(values_obj);
        });

        $('.datepicker').change((event) => {
            const values_obj = getValues();
            console.log(values_obj);
            clearApplicationMessage();
            hideResultsTable();
            getData(values_obj);
        });
    }

    const initDatePickers = () => {
        $('.datepicker').datepicker();
    }

    const init = () => {
        setEventListeners();
        initDatePickers();
    }

    $(init);
})();