$(document).ready(function () {


    var clickedState = {};

    var stance = {
        S: 'Supporting',
        O: 'Opposing',
        U: 'Unknown'
    };


    var dateFormat = 'MMM Do, YYYY ';


    $("#specificExpenderText").click(function () {
        $("#specificExpendersRadio").prop("checked", true)
    });

    $("#specificCandidatesText").click(function () {
        $("#specificCandidatesRadio").prop("checked", true)
        $('#measure-form-panel *').prop('disabled', true);
        $('#measure-form-panel *').css('cursor', 'not-allowed');
        $('#measure-form-panel').css('opacity', '.4');


    });

    $(".specificDateRange").click(function () {
        $("#dateRangeRadio").prop("checked", true)
    });

    $(".electionCycle").click(function () {
        $("#electionCyclesRadio").prop("checked", true)
    });

    $("#office").change(function () {
        // $('#measure-form-panel').block({ message: null });
        $("#districtOrOffice").prop("checked", true);
        $('#measure-form-panel *').prop('disabled', true);
        $('#measure-form-panel *').css('cursor', 'not-allowed');
        $('#measure-form-panel').css('opacity', '.4');
    });

    $("#measure").change(function () {
        $("#specificMeasuresTextRadio").prop("checked", true)
        $('#candidate-form-panel *').prop('disabled', true);
        $('#candidate-form-panel *').css('cursor', 'not-allowed');
        $('#candidate-form-panel').css('opacity', '.4');

    })

    $(function () {


        $('[data-toggle="tooltip"]').tooltip();


        $("#measure-form-check,#candidate-form-check").change(function () {
            $('#measure-form-panel *,#candidate-form-panel *').prop('disabled', false);
            $('#measure-form-panel *,#candidate-form-panel *').css('cursor', '');
            $('#measure-form-panel,#candidate-form-panel').css('opacity', '1');
        });


        // Custom autocomplete instance.
        $.widget("app.autocomplete", $.ui.autocomplete, {

            // Which class get's applied to matched text in the menu items.
            options: {
                highlightClass: "ui-state-highlight"
            },

            _renderItem: function (ul, item) {

                // Replace the matched text with a custom span. This
                // span uses the class found in the "highlightClass" option.
                var re = new RegExp("(" + this.term + ")", "gi"),
                        cls = this.options.highlightClass,
                        template = "<span class='" + cls + "'>$1</span>",
                        label = item.label.replace(re, template),
                        $li = $("<li/>").appendTo(ul);

                // Create and return the custom menu item content.
                $("<a/>").attr("href", "#")
                        .html(label)
                        .appendTo($li);

                return $li;

            }

        });


        $("#specificExpenderText").autocomplete({
            min: 2,
            options: {
                highlightClass: "ui-state-highlight"
            },
            //appendTo: ".panel-body",

            source: function (request, response) {

                $.ajax(
                        {
                            url: location.origin + "/ie/ExpanderNameAutoComplete",
                            dataType: "json",
                            data: {
                                term: request.term
                            },
                            success: function (data) {
                                //console.log(_.pluck(data,'ExpenderName'))
                                response(_.pluck(data, 'ExpenderName'))
                            }
                        });
            },
            open: function (event, ui) {
                $(".ui-autocomplete").css("z-index", 1000);
            }

        });

        $("#specificCandidatesText").autocomplete({
            min: 2,
            options: {
                highlightClass: "ui-state-highlight"
            },
            //appendTo: ".panel-body",

            source: function (request, response) {

                $.ajax(
                        {
                            url: location.origin + "/ie/targetCandidateNameAutoComplete",
                            dataType: "json",
                            data: {
                                term: request.term
                            },
                            success: function (data) {
                                //console.log(_.pluck(data,'ExpenderName'))
                                response(_.pluck(data, 'TargetCandidateName'))
                            }
                        });
            },
            open: function (event, ui) {
                $(".ui-autocomplete").css("z-index", 1000);
            }

        });

        $.ajax({
            url: location.origin + "/ie/officeDropdown"
        })
                .done(function (data) {


                    for (x = 0; x < data.length; x++) {
                        $("#office").append($("<option></option>")
                                .attr("value", data[x].TargetCandidateOffice)
                                .text(data[x].TargetCandidateOffice));
                    }

                })
                .fail(function (xhr) { //, textStatus, errorThrown) {
                    alert(xhr);
                    if (console && console.log) {
                        console.log("search ajax fail: ", xhr);
                    }
                });

        $.ajax({
            url: location.origin + "/ie/measureDropdown"
        })
                .done(function (data) {

                    var prev = data[0].Election.split('T')[0];
                    $("#measure").append($("<optgroup>").attr("label", moment(data[0].Election.split('T')[0]).format(dateFormat) + " Ballot Measures"));

                    for (var x = 0; x < data.length; x++) {

                        if (prev == data[x].Election.split('T')[0]) {
                            $("#measure").append($("<option></option>")
                                    .attr("value", data[x].TargetPropositionName)
                                    .text(data[x].TargetPropositionName));
                        } else {
                            $("#measure").append($("</optgroup>"));
                            $("#measure").append($("<optgroup>").attr("label", moment(data[x].Election.split('T')[0]).format(dateFormat) + " Ballot Measures"));
                            $("#measure").append($("<option></option>")
                                    .attr("value", data[x].TargetPropositionName)
                                    .text(data[x].TargetPropositionName));
                        }
                        prev = data[x].Election.split('T')[0];
                    }

                    $("#measure").append($("</optgroup>"));

                })
                .fail(function (xhr) { //, textStatus, errorThrown) {
                    alert(xhr);
                    if (console && console.log) {
                        console.log("search ajax fail: ", xhr);
                    }
                });


    })
    // query parameter object
    var qps = {};

    // attach parameters onto request
    function buildQueryParameter(name, value) {
        qps[name] = value;
    }


    function clearResultsDisplay() {
        $("#total").html('');
        $("#total-text").html('');


        $("#amount-identifier").html('');

        $("#first-row-value").html('');
        $("#first-row-text").html('');

        $("#second-row-value").html('');
        $("#second-row-text").html('');
    }

    // handle on clear button click, set all fields to initial state
    function onClear() {


        $("#sort").html('');

        $("#total").html('');
        $("#total-text").html('');


        $("#amount-identifier").html('');

        $("#first-row-value").html('');
        $("#first-row-text").html('');

        $("#second-row-value").html('');
        $("#second-row-text").html('');

        $("#specificExpendersRadio").prop("checked", false);
        $("#specificCandidatesRadio").prop("checked", false);
        $("#specificMeasuresTextRadio").prop("checked", false);
        $("#dateRangeRadio").prop("checked", false);
        $("#electionCyclesRadio").prop("checked", false);


        $('#specificExpenderText').val('');
        $("#specificCandidatesText").val('');
        $("#specificMeasuresText").val('');
        $(".specificDateRange").val('');

        $(".electionCycle").prop("checked", false);
        $(".defaultSelect").prop("checked", true);

        $(".defaultSelect").val('');


        $("#jumbotron").removeClass("hidden");
        $("#jumbotron").addClass("show");
        //$("jumbotron").addClass("hidden");
        $("#results").removeClass("show");
        $("#results").addClass("hidden");


        $('#measure-form-panel *,#candidate-form-panel *').prop('disabled', false);
        $('#measure-form-panel *,#candidate-form-panel *').css('cursor', '');
        $('#measure-form-panel,#candidate-form-panel').css('opacity', '1');

        return;
    }

    $("#clearForm").click(function (event) {
        onClear();
    });


    $("#btnSearch").click(function (event, sortBy, sortDir) {
        event.preventDefault();


        if (!sortBy)
            clearResultsDisplay();

        var supportCount = 0;
        var supportAmount = 0
        var expenderNameCase = false;
        var candidateOrMeasuresCase = false;
        var dateCase = false;
        var officevalue = "";
        var measureValue = "";
        var candidateValue = "";

        // After the first search button click,
        // we want to hide the jumbotron.  Subsequent
        // clicks will just continue to hide the jumbotron
        $("#jumbotron").addClass("hidden");
        //$("jumbotron").addClass("hidden");
        $("#results").removeClass("hidden");
        $("#results").addClass("show");

        var qp = "";

        // expender name
        if ($("input:radio[name=expendername]:checked").val() === "specificExpenders" &&
                $("specificExpenderText").val() != "undefined") {
            expenderNameCase = true;
            qp += "expendername=" + encodeURIComponent($("#specificExpenderText").val()) + "&";
        }

        // supporting or opposing
        if ($("#SOU").val().length > 0) {
            qp += "stance=" + $("#SOU").val() + "&";
        }

        // candidates
        if ($("input:radio[name=candidates]:checked").val() === "specificCandidates") {
            candidateOrMeasuresCase = true;
            candidateValue = $("#specificCandidatesText").val();
            qp += "candidatename=" + encodeURI($("#specificCandidatesText").val()) + "&";
        }

        if ($("input:radio[name=candidates]:checked").val() === "districtOrOffice") {
            candidateOrMeasuresCase = true;
            officevalue = $("#office").val();
            qp += "candidateoffice=" + encodeURI($("#office").val()) + "&";
            //qp += "candidatedistrict=" + encodeURI($("#district").val()) + "&";
        }

        // measures
        if ($("input:radio[name=measures]:checked").val() === "specificMeasure") {
            candidateOrMeasuresCase = true;
            measureValue = $("#measure").val();
            qp += "propositionname=" + encodeURI($("#measure").val()) + "&";
        }


        // dates
        if ($("input:radio[name=dates]:checked").val() === "dateRange") {
            qp += "datestart=" + encodeURI($("#dateStartText").val()) + "&";
            qp += "dateend=" + encodeURI($("#dateEndText").val()) + "&";
            dateCase = true;
        }

        if ($("input:radio[name=dates]:checked").val() === "electionCycles") {
            var electionCyclesArray = $("#electionCycleTable input:checkbox:checked").map(function () {
                return $(this).val();
            }).get();
            qp += "electioncycle=" + encodeURI(electionCyclesArray) + "&";

        }

        console.log(sortDir);
        console.log(sortBy);
        if (sortBy != null && sortDir != null) {

            qp += "sortBy=" + encodeURI(sortBy) + "&";
            qp += "sortDir=" + encodeURI(sortDir);
        }

        $.ajax({
            url: location.origin + "/ie/search?" + qp,
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function (data) {

            $('#csvLink').attr({
                download: 'Independent-Expenditure-' + moment().format("MMM-Do-YY") + '.csv',
                href: '/ie/csvDownload?' + qp,
                target: '_blank'
            });


            $("#resultsTable").html('<table class="table table-striped table-bordered truncate" cellspacing="0" width="100%" id="example"></table>');

            var parsedDataset = [];
            var jsonObj = JSON.parse(data);
//
//                        console.log(jsonObj)
//                        console.log(jsonObj.totals);
//                        console.log(jsonObj.candidateExpenditures);
//                        console.log(jsonObj.propositionExpenditures);
//                        console.log(jsonObj.expenderSupport);
//                        console.log(jsonObj.expenderOppose);
//
            for (var i = 0; i < _.size(jsonObj.payload); i++) {

                parsedDataset.push([
                    jsonObj.payload[i].TargetCandidateName,
                    jsonObj.payload[i].TargetCandidateOffice,
                    jsonObj.payload[i].TargetPropositionName,
                    stance[jsonObj.payload[i].ExpenderPosition],
                    jsonObj.payload[i].ExpenderName,
                    jsonObj.payload[i].ExpenderID,
                    numeral(jsonObj.payload[i].Amount).format('$0,0.00'),
                    jsonObj.payload[i].ExpenditureDscr,
                    jsonObj.payload[i].PayeeName,
                    jsonObj.payload[i].DateRange != null && (jsonObj.payload[i].DateRange.indexOf("to") > -1) ? jsonObj.payload[i].DateRange : (jsonObj.payload[i].DateStart != null ? jsonObj.payload[i].DateStart.split('T')[0] : "")
                ]);
            }


            $('#example').dataTable({
                "aaSorting": [],
                "scrollY": "100%",
                "scrollX": true,
                "data": parsedDataset,
                "columns": [
                    {"title": "Candidate Name"},
                    {"title": "Candidate Office"},
                    {"title": "Ballot Measure"},
                    {"title": "Position"},
                    {"title": "Expender"},
                    {"title": "Expender ID"},
                    {"title": "Amount"},
                    {
                        "title": "Description",
                        "defaultContent": "",
                    },
                    {
                        "title": "Payee",
                        "defaultContent": "",
                    },
                    {
                        "title": "Date",
                        "defaultContent": "",
                    }

                ]
            })




            $("#total").html(numeral(jsonObj.totals).format('$0,0.00'));
            $("#total-text").html(" in " + jsonObj.amount + " independent expenditures");


            if (candidateOrMeasuresCase && !expenderNameCase) {
                if (jsonObj.propositionExpenditures) {
                    $('#amount-identifier').html($("#measure").val());

                    if (jsonObj.expenderSupport) {
                        $("#first-row-value").html(numeral(jsonObj.expenderSupport.sum).format('$0,0.00'));
                        $("#first-row-text").html("in " + jsonObj.expenderSupport.count + " supporting independent expenditures")

                    } else {
                        $("#first-row-value").html(numeral(0.0).format('$0,0.00'));
                        $("#first-row-text").html("in " + 0 + " supporting independent expenditures")

                    }
                    if (jsonObj.expenderOppose) {
                        $("#second-row-value").html(numeral(jsonObj.expenderOppose.sum).format('$0,0.00'));
                        $("#second-row-text").html("in " + jsonObj.expenderOppose.count + " opposing independent expenditures")
                    } else {
                        $("#second-row-value").html(numeral(0.0).format('$0,0.00'));
                        $("#second-row-text").html("in " + 0 + " opposing independent expenditures")
                    }

                } else {
                    if (jsonObj.candidateExpenditures) {
                        $('#amount-identifier').html($("#office").val() || $("#specificCandidatesText").val());

                        if (jsonObj.expenderSupport) {
                            $("#first-row-value").html(numeral(jsonObj.expenderSupport.sum).format('$0,0.00'));
                            $("#first-row-text").html("in " + jsonObj.expenderSupport.count + " supporting independent expenditures")

                        } else {
                            $("#first-row-value").html(numeral(0.0).format('$0,0.00'));
                            $("#first-row-text").html("in " + 0 + " supporting independent expenditures")

                        }
                        if (jsonObj.expenderOppose) {
                            $("#second-row-value").html(numeral(jsonObj.expenderOppose.sum).format('$0,0.00'));
                            $("#second-row-text").html("in " + jsonObj.expenderOppose.count + " opposing independent expenditures")
                        } else {
                            $("#second-row-value").html(numeral(0.0).format('$0,0.00'));
                            $("#second-row-text").html("in " + 0 + " opposing independent expenditures")
                        }
                    }


                }

            } else {

                $('#amount-identifier').html($("#specificExpenderText").val());// + " to " + (officevalue || candidateValue || measureValue));

                if (jsonObj.candidateExpenditures) {
                    $("#first-row-value").html(numeral(jsonObj.candidateExpenditures.sum).format('$0,0.00'));
                    $("#first-row-text").html("in " + jsonObj.candidateExpenditures.count + " independent expenditures affecting candidates")

                } else {
                    $("#first-row-value").html(numeral(0.0).format('$0,0.00'));
                    $("#first-row-text").html("in " + 0 + " independent expenditures affecting candidates")

                }
                if (jsonObj.propositionExpenditures) {
                    $("#second-row-value").html(numeral(jsonObj.propositionExpenditures.sum).format('$0,0.00'));
                    $("#second-row-text").html("in " + jsonObj.propositionExpenditures.count + " independent expenditures affecting ballot measures")

                } else {
                    $("#second-row-value").html(numeral(0.0).format('$0,0.00'));
                    $("#second-row-text").html("in " + 0 + " independent expenditures affecting ballot measures")

                }

            }


            $('th').unbind('click.DT');


            // $('table').find('th').attr('aria-sort', 'descending');

            $('th, .sorting_desc, .sorting_asc').on('click', function (event) {

                        //    clickedState[sortBy] = sortDir;

                        if ($(this).text() === sortBy) {
                            if (sortDir === "descending") {
                                direction = "ascending";
                                $(this).addClass('sorting_asc');
                            } else {
                                direction = "descending";
                                $(this).addClass('sorting_desc');
                            }
                        }
                        else {
                            direction = "descending"
                            $(this).addClass('sorting_desc');
                        }

                        $("#btnSearch").trigger('click', [$(this).text(), direction]);

                    }
            );

        })
        .fail(function (xhr) { //, textStatus, errorThrown) {
            alert(xhr);
            if (console && console.log) {
                console.log("search ajax fail: ", xhr);
            }
        });

    });

});