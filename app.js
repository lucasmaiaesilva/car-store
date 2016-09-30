(function(DOM) {
  'use strict';

  var app = (function() {
    return {

      init: function() {
        this.companyInfo();
        this.initEvents();
        this.getCars();
      },

      initEvents: function initEvents() {
        var $formCadastro = new DOM('[data-js="formCadastro"]');
        $formCadastro.on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var $display = new DOM('[data-js="display"]').get()[0];
        // $display.appendChild(app.createNewCar());
        app.createNewCar();
        app.getCars();
      },

      createNewCar: function createNewCar() {
        var $fragment = document.createDocumentFragment();
        var p = document.createElement('p');
        var span = document.createElement('span');
        // get the items
        var $inputImagem = new DOM('[data-js="inputImagem"]').get()[0].value;
        var $inputMarcaModelo = new DOM('[data-js="inputMarcaModelo"]').get()[0].value;
        var $inputAno = new DOM('[data-js="inputAno"]').get()[0].value;
        var $inputPlaca = new DOM('[data-js="inputPlaca"]').get()[0].value;
        var $inputCor = new DOM('[data-js="inputCor"]').get()[0].value;

        app.postNewCar($inputImagem, $inputMarcaModelo, $inputAno, $inputPlaca, $inputCor);

      },

      getCars: function getCars() {
        var ajaxGet = new XMLHttpRequest();
        ajaxGet.open('GET', 'http://localhost:3000/car');
        ajaxGet.send();
        ajaxGet.addEventListener('readystatechange', this.handleGetCars, false);
      },

      handleGetCars: function handleGetCars() {
        if(this.readyState === 4) {
          app.displayItems(JSON.parse(this.responseText));
        }
      },

      displayItems: function displayItems(arr) {
        var $display = document.querySelector('#result');
        $display.innerHTML = '';
        arr.forEach(function(car){
          var $p = document.createElement('p');
          var $span = document.createElement('span');

          $span.textContent += 'imagem ' + car.image + ' - ';
          $span.textContent += 'marca / modelo ' + car.brandModel + ' - ';
          $span.textContent += 'ano ' + car.year + ' - ';
          $span.textContent += 'placa ' + car.plate + ' - ';
          $span.textContent += 'cor ' + car.color + ' - ';
          $span.appendChild(app.mountRemoveLink());
          $p.appendChild($span);
          $display.appendChild($p);
        });

      },

      postNewCar: function postNewCar(imagem, marca, ano, placa, cor) {
        var postCar = new XMLHttpRequest();
        postCar.open('POST', 'http://localhost:3000/car');
        postCar.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        postCar.send('image='+ imagem +'&brandModel='+ marca +'&year='+ ano +'&plate='+ placa +'color='+ cor);

        console.log('Cadastrando carro...');
        postCar.addEventListener('readystatechange', this.handlePostCar, false);
      },

      handlePostCar: function handlePostCar() {
        if(this.readyState === 4) {
          console.log('carro cadastrado.');
        }
      },

      mountRemoveLink: function mountRemoveLink() {
        var $a = document.createElement('a');
        $a.setAttribute('href', '#');
        $a.textContent = 'remove item';
        $a.addEventListener('click', function(e){
          this.parentNode.parentNode.remove(1);
        }, false);
        return $a;
      },

      companyInfo: function() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', './company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        // this aqui é o objeto ajax
        if(!app.isReady.call(this))
          return;
        var data = JSON.parse(this.responseText);
        var $companyName = new DOM('[data-js="companyName"]');
        var $companyNumber = new DOM('[data-js="companyNumber"]');
        $companyName.get()[0].textContent = data.name;
        $companyNumber.get()[0].textContent = data.phone;
      },

      isReady: function isReady() {
        return this.status === 200 && this.readyState === 4;
      }
    };
  })();

  app.init();

})(window.DOM);
