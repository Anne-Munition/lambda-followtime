module.exports = (name, date) => {
  return `
<html lang="en">
<script src="https://cdn.jsdelivr.net/npm/luxon@2.3.1/build/global/luxon.min.js" integrity="sha256-e2xkOE+oa0Ux7mVa39RFbhewJ4rMMlud92zYs61NHFY=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.6.0.slim.min.js" integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI=" crossorigin="anonymous"></script>
<script>
    const start = luxon.DateTime.now();
    const end = luxon.DateTime.fromISO("${date}");
    const timestamp = end.toFormat('FFFF');

    const units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
    const diff = start.diff(end, units).toObject();

    const followDuration = units
      .map((unit) => {
        const amount = Math.floor(diff[unit]);
        const s = amount === 1 ? '' : 's';
        return amount + ' ' + unit.slice(0, -1) + s;
      })
      .join(', ');

    $(document).ready(function() {
        $("#timestamp").text(timestamp);
        $("#duration").text(followDuration);
    });
</script>
<style>
    body {
        background-color: #141414;
        color: #bfbfbf;
        font-size: 24px;
    }
    #content {
        max-width: 900px;
        margin: auto;
        text-align: center;
    }
    #timestamp {
        display: block;
        font-size: 20px;
    }
    #duration {
        display: inline-block;
        background-color: #353535;
        padding: 5px;
    }
</style>
<body>
    <div id="content">
        <h1>~~Followtime~~</h1>
        <p>${name} has been following AnneMunition since:</p>
        <span id="timestamp"></span>
        <p id="duration"></p>
    </div>
</body>
</html>
`;
};
