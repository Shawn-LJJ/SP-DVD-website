function header() {

    const headingStyle = {
        textShadow: 'black -4px -3px 6px',
        color: 'darkslategrey',
        fontFamily: 'MV Boli',
        borderBottom: '2px black solid'
    }

    const overallStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: '20px'
    }

    return (
        <div style={overallStyle}>
            <h1 style={headingStyle}>SP DVD database</h1>
        </div>
    )
}

export default header;