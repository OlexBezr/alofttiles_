document.addEventListener("DOMContentLoaded", function() {
  let params = (new URL(document.location)).searchParams; 
  if(params.get("filter.p.m.custom.in_stock") == '1') 
      $('#custom-instock').attr('checked', true)

  document.querySelectorAll('#custom-instock').forEach((el) => {
    el.addEventListener('input', function(e) {
      e.preventDefault();
      let btn_instock = document.querySelector('input[name="filter.p.m.custom.in_stock"]')
      if(btn_instock.value == '1') {
        btn_instock.click()
      }
    })
  })
});