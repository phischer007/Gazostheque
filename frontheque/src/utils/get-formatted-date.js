// export const formatDate = (date) => {
//     const loanDate = new Date(date);
//     const formattedDate = loanDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });
//     return formattedDate;
// };

export const formatDetailedDate = (date) => {
    const loanDate = new Date(date);
    const formattedDate = loanDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    return formattedDate;
};

export const formatArriveeDate = (date) => {
    const arriveeDate = new Date(date);
    const day = String(arriveeDate.getDate()).padStart(2, '0');
    const month = String(arriveeDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = arriveeDate.getFullYear();
    
    return `${day}/${month}/${year}`;
};

export const formatDepartDate = (date) => {
    const departDate = new Date(date);
    const day = String(departDate.getDate()).padStart(2, '0');
    const month = String(departDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = departDate.getFullYear();
    
    return `${day}/${month}/${year}`;
};