        var commit
        ,   date
        ,   parser = new UAParser()
        ,   ua = parser.getResult()
        ,   device = ""
        ;
        
        for(var i in ua.device) // if there is any, usually works on mobile
            if(ua.device[i]) device += ua.device[i] + ' ';

        device = device.trim();

        $('.topcoat-version').on('keyup', function () {
            var val = $(this).val().trim().split(' ');
            commit = val.shift();
            date = val.join(' ');
            if(commit.length == 40 && date.length) {
                if(Date.parse(date)) {
                    $('input[type=checkbox]').attr('disabled', false).attr('checked', 'true');
                    $('#submit').attr('disabled', false);
                }
                else
                    alert('Invalid Date');
            }
        });

        $('#submit').on('click', function () {
            var results = window.results;
            $.post("http://topcoat.herokuapp.com/stressCSS", { // used $.post since xhr doesn't work on android 2.2 from what I've seen
              baselineTime: results.baselineTime,
              commit: commit,
              date: date,
              selector: results.selector,
              device: device,
              ua: navigator.appVersion
            }).success(function(data){
              console.log(data);
            });

        });