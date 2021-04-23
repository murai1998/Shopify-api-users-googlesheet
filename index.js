async function main() {
  //===================SPREADSHEET======================
 spreadsheet = async()=> {
    try {
      await doc.useServiceAccountAuth(creds);
      await doc.useServiceAccountAuth({
        client_email:
          "<email>",
        private_key:
          "<key>"    });
      await doc.loadInfo(); 
      //=========================================

    const sheet = doc.sheetsByIndex[0];
      await sheet.loadCells('A1:H1'); 
      const ceil = await sheet.getCellByA1('H1');
    return ceil.value
    } catch (err) {
      console.log(err);
    }
  }
  //==============================================
  let ID = await spreadsheet();
gift_cards = async () =>{
    try {
        let all_products = []
      let params = { limit: 100 };

      do {
        let products = await shop.giftCard.list({"since_id": ID});
        products.forEach(x => {
            all_products.push({ ID: x.id, balance: x.balance, note: x.note, user_id: x.customer_id})
            console.log(all_products.length)
        })
        params = products.nextPageParameters;
      } while (params !== undefined);
      return all_products;
    } catch (err) {
      console.log(err);
    }
  }
  let res = await gift_cards()

  modify_data =async(res)=>{
    if(res.length > 0){
    let new_ID = res[res.length - 1].ID
    console.log("New id", new_ID)
    let results = []
    let promise_data = Promise.all(res.map(async card =>{
        order_id  = card.note.match(//)
        if(order_id.length > 0){
          card.note = order_id[0].replace(//, '')
          let user = await shop.customer.get(card.user_id)
          results.push({'ID': `${card.note}`, "Name": `${user.first_name} ${user.last_name}`, "Email": user.email, "Phone": user.phone,  "Card balance": `$${card.balance}` })
        }
    }))
  let r1 = await promise_data
  return {id: new_ID, arr: results}
    }
  }
let mod_data = await modify_data(res)
console.log(mod_data)
  async function spreadsheet2(results) {
    try {
      await doc.useServiceAccountAuth(creds);
      await doc.useServiceAccountAuth({
        client_email:
          client_email:
          "<email>",
        private_key:
          "<key>"   });
      await doc.loadInfo(); 
      //=========================================
   
    console.log(results.id)
    const sheet = doc.sheetsByIndex[0];
    let today = new Date()
    const date1 = await sheet.addRows([{'ID': ``, "Name":'', "Email": '',  "Card balance": '' }]);
    const date2 = await sheet.addRows([{'ID': `${today.toDateString()}`, "Name":'', "Email": '',  "Card balance": '' }]);
    const moreRows = await sheet.addRows(results.arr);
    console.log("Rows", moreRows)
    await sheet.loadCells('A1:H1'); 
    const ceil = await sheet.getCellByA1('H1');
    ceil.value = results.id;
    await sheet.saveUpdatedCells();
    } catch (err) {
      console.log(err);
    }
  }
  if(mod_data){
  spreadsheet2(mod_data)
  }
}

main()
