const columns = [
    { title: 'Id', getVal: obj => obj.id },
    { title: 'Name', getVal: obj => obj.name, setVal: name => ({ name }) },
    { title: 'Address', getVal: obj => obj.address?.city },
    { title: 'Email', getVal: obj => obj.email, setVal: email => ({ email }) },
    { title: 'Website', getVal: obj => obj.website, setVal: website => ({ website }) },
    { title: 'Phone number', getVal: obj => obj.phone, setVal: phone => ({ phone }) },
    { title: 'Company name', getVal: obj => obj.company?.name }
];

export default columns;