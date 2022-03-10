module.exports = (name) => {
  return `
<html lang="en">
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
</style>
<body>
    <div id="content">
    <h1>~~Followtime~~</h1>
    <p>
        ${name} is not a valid Twitch user.
    </p>
    </div>
</body>
</html>
`;
};
