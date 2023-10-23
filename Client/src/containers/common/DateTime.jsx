// import React from 'react'

const DateTime = () => {
    const showdate = new Date();
    const displaytodayDate = showdate.getDate() + '/' + (showdate.getMonth() + 1) + '/' + showdate.getFullYear();
    // const dt = showdate.toDateString()
    // const displayTime = showdate.getHours() + ':' + showdate.getMinutes() + ':' + showdate.getMilliseconds();
    return displaytodayDate;
    
    // return (
    //     <p>
    //         <input type="text" value={displaytodaysdate} readOnly='true'/>
    //     </p>
    // )
}

export default DateTime