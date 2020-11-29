exports.getDate = () => {
    const today = new Date()

    // from stack overflow, to formart today
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }

    return today.toLocaleDateString('en-US', options)
}

exports.getDay = () => {
    const today = new Date()

    // from stack overflow, to formart today
    const options = {
        weekday: 'long',
    }

    return today.toLocaleDateString('en-US', options)
}
