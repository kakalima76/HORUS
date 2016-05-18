angular.module('starter.controllers', [])

.controller('multasCtrl', ['$ionicPopup', '$scope', 'factoryAutorizado', '$state', 'loginFactory', 'factoryPontos', function($ionicPopup, $scope, factoryAutorizado, $state, loginFactory, factoryPontos){
  $scope.apoio = 'templates/artigos.html';
  $scope.artigos = ['', 47, 54];
  $scope.incisos =
  [

            {artigo: '47', inciso: 'II',  texto: 'Mercadejar em desacordo com os termos de sua autorização.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'III',   texto: 'Não se apresentar em rigorosas condições de asseio.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IV',  texto: 'Apresentar-se em veículo ou unidade autorizada em mau estado de conservação ou em condições precárias de higiene.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'V',   texto: 'Não manter limpo o local de estacionamento.', valor: 'R$ 783,00', pontos: 2},
            {artigo: '47', inciso: 'VI',  texto: 'Utilizar buzinas, campainhas e outros meios ruidosos de propaganda.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VII',   texto: 'Não apresentar, quando exigidos, quaisquer dos documentos a que se refere o artigo 56 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'VIII',  texto: 'Não manter, em local visível, a tabela de preços dos produtos comercializados exigida pelo art. 57 desta Lei.', valor: 'R$ 391,50', pontos: 2},
            {artigo: '47', inciso: 'IX',  texto: 'Comercializar produtos proibidos por esta Lei.', valor: 'R$ ', pontos: 5},
            {artigo: '47', inciso: 'X',   texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública.', valor: 'R$ 1566,00', pontos: 5},
            {artigo: '47', inciso: 'XI',  texto: 'Uso de caixotes como assento ou para exposição de mercadoria sobre o passeio.', valor: 'R$ 391,50', pontos: 5},
            {artigo: '47', inciso: 'XII',   texto: 'Prejuízo do fluxo de pedestre na calçada.', valor: 'R$ 783,0', pontos: 5},
            {artigo: '47', inciso: 'XIII',  texto: 'Ocupação não autorizada de área pública por qualquer equipamento fixo ou móvel diferente de tabuleiro, carrocinha e triciclo.', valor: 'R$ 3915,00', pontos: 2},
            {artigo: '54', inciso: 'I',   texto: 'Perturbação da ordem pública, falta de urbanidade, incontinência pública, prática de crime ou contravenção no local do ponto fixo.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'II',  texto: 'Permanência em local diferente do autorizado.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'III',   texto: 'Mudança do ponto fixo sem prévia autorização.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'IV',  texto: 'Inobservância do Regulamento Sanitário.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'V',   texto: 'Uso de caixotes como assento ou para exposição de mercadorias sobre o passeio.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VI',  texto: 'Impedimento do livre trânsito nos passeios.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VII',   texto: 'Venda de mercadoria não permitida nesta Lei.', valor: 'R$ R$ 391,50', pontos: 5},
            {artigo: '54', inciso: 'VIII',  texto: 'Venda de mercadoria não autorizada.', valor: 'R$ R$ 391,50', pontos: 5}
    ];

   //reseta os campos do checkbox
  function zera(){
    $scope.incisos.forEach(function(value){
      value.checked = false;
    })
  }



  $scope.imprimir = function(){
    var soma = 0; //soma os pontos das autuações
    var multas = ''; //auto esplicativa
    var count = 0; //conta as autuações
    function filtro(value){
      if(value.checked === true){
        return true;
      }
    }
    
    //seleciona apenas as autuações ticadas
    var res = $scope.incisos.filter(filtro)
    
    res.forEach(function(value){
      count += 1;
      soma += value.pontos;
      multas += '{artigo: ' + value.artigo + ', inciso:' + "'" + value.inciso + "'" + '},';
    })

          if(soma > 0){

                if(count === 1){
                  var confirmPopup = $ionicPopup.confirm({
                  title: 'Salvar Registro',
                  template: 'Confirma apenas uma autuação?'
                  });
                }else{
                  var confirmPopup = $ionicPopup.confirm({
                  title: 'Salvar Registro',
                  template: 'Confirma as ' + count + ' autuações?'
                  });
                }
             
             confirmPopup.then(function(res) {
             if(res) {
                  multas = multas.substring(0,multas.length - 1);
                  factoryAutorizado.setPontos(soma);
                  factoryAutorizado.setMulta(multas);
                  loginFactory.criar(factoryAutorizado.get());
                  zera();
                  $state.go('assentamento');
                }
           });

          }else{
            alert('Opções em branco.')
          }
  }//fim da função imprimir




}])

.controller('vistoriaCtrl', ['$http','factoryVistoria', '$scope', 'factoryAgente', 'factoryLocaliza', '$cordovaCamera', function($http, factoryVistoria, $scope, factoryAgente, factoryLocaliza, $cordovaCamera){
  $scope.testar = function(){
    var agente = factoryAgente.get();
    var local = factoryLocaliza.get();
    var numero = document.getElementById('numero').value;
    var servico = document.getElementById('servico').value;
    var acao = document.getElementById('acao').value;
    var comentario = document.getElementById('comentarios').value;


    vistoria = 
    {
      numero: (numero || ''),
      servico: (servico || ''),
      acao: (acao || ''),
      comentario: (comentario || ''),
      hora: (local.hora || ''),
      latitude: (local.latitude || 0),
      longitude: (local.longitude || 0)
    }
    
    factoryVistoria.set(agente.ordem, agente.nome, agente.matricula, vistoria.numero, vistoria.servico, vistoria.acao, vistoria.comentario, vistoria.hora, vistoria.latitude, vistoria.longitude);
    factoryVistoria.save(factoryVistoria.get());
  }

  $scope.tirarFoto = function(){
     var options =
    {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: false
    };


    $cordovaCamera.getPicture(options)
    .then(function(data){
     var agente = factoryAgente.get();
     var documento = document.getElementById('numero').value;
     var servico = document.getElementById('servico').value;
     var acao = document.getElementById('acao').value;

      var foto = 
        {
          agente: agente.nome,
          ordem: agente.ordem,
          data: agente.data,
          documento: documento,
          servico: servico,
          acao: acao,
          foto: data
        }

      var promisse = $http.post('https://ccuanexos.herokuapp.com/imagem', foto);
      promisse.then(function(data){
      })

    }, function(err){
      alert('Não foi possível salvar a foto, tente novamente.')
    })
  }

}])

.controller('loginCtrl', ['$scope',  '$state', 'loginFactory', function($scope, $state, loginFactory){
    $scope.entrar = function(){
      loginFactory.logar();             
    }//fim do método entrar
  
}])


.controller('assentamentoCtrl', ['inscricaofactory', '$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryAgente', 'factoryLocaliza', 'factoryPontos', function(inscricaofactory, $scope,  factoryAutorizado, $state, tipificaService, loginFactory, factoryAgente, factoryLocaliza, factoryPontos){
      
      $scope.titulo = factoryAgente.getOrdem();
      $scope.clickInconformidade = false;
      $scope.clickConformidade = false;
      $scope.clickEncerrar = false;
      $scope.listaEscolha = ['', 'CONFORMIDADE', 'INCONFORMIDADE', 'AUSENTE', 'PREPOSTO', 'TERCEIROS', 'VISTORIA','VER OS', 'SCCA']
      $scope.clickSolicitar = false;
      $scope.clickCuca = true;
      
      if(factoryAgente.getChefe()){
        $scope.listaEscolha.push('SOLICITAR');
      }
      
      
    $scope.buscar = function(){

          var promise = factoryAutorizado.extrair(document.getElementById('im').value);

          promise.catch(function(){
            $scope.proteger = false;
            document.getElementById('im').focus();
            document.getElementById('im').value = '';
            alert('Informe uma IM válida!');
          })

          factoryLocaliza.localiza();
          $scope.proteger = true;


    }//fim do método buscar

    $scope.limpar = function(){
      $scope.proteger = false;
      document.getElementById("im").value = '';
      document.getElementById("titular").value = '';
      
    };//fim do método limpar

    $scope.selecionar = function(){
        if (document.getElementById('status').value == 'INCONFORMIDADE') {
            $scope.clickConformidade = false;
            $scope.clickInconformidade = true;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
            $scope.clickCuca = false;
        }else if (document.getElementById('status').value == 'VISTORIA'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = true
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
            $scope.clickCuca = false;
        }else if (document.getElementById('status').value == 'SOLICITAR'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = true;
            $scope.clickVisualisar = false;
            $scope.clickCuca = false;
        }else if (!document.getElementById('status').value){
            $scope.clickInconformidade = false;
            $scope.clickConformidade = false;
            $scope.clickEncerrar = true;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
            $scope.clickCuca = false;
        }else if (document.getElementById('status').value == 'VER OS'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = true;
            $scope.clickCuca = false;
        }else if (document.getElementById('status').value == 'SCCA'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
            $scope.clickCuca = true;
        }else{
            $scope.clickConformidade = true;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
            $scope.clickCuca = false;
        }
    };//fim do método selecionar
    var conformidade = function(){
      //vou aproveitar e atualizar o logado no objeto autorizado
      
     var flag;
      if(document.getElementById('status').value === 'INCONFORMIDADE'){
        flag = 'INCONFORME';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'CONFORMIDADE'){
        flag = 'CONFORME';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'AUSENTE') {
        flag = 'AUSENTE';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'PREPOSTO') {
        flag = 'PREPOSTO';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'TERCEIROS') {
        flag = 'TERCEIROS';
        factoryAutorizado.setEstado(flag);
      }

    }//fim dda função conformidade

    var logado = function(){
        var local = factoryLocaliza.get();
        var usuario = factoryAgente.get();
        factoryAutorizado.setNome(usuario.nome);
        factoryAutorizado.setMatricula(usuario.matricula);
        factoryAutorizado.setOrdem(usuario.ordem);
        factoryAutorizado.setData(usuario.data);
        factoryAutorizado.setLatitude(local.latitude);
        factoryAutorizado.setLongitude(local.longitude);
        factoryAutorizado.sethoraAutuacao(local.hora);

    }

    $scope.novaFiscalizacao = function(){
      logado();
      conformidade();
      $scope.limpar();
      loginFactory.criar(factoryAutorizado.get());
    };//fim do método novaFiscalização

    $scope.multar = function(){
      $scope.multas = 0;
      factoryPontos.setPontos(0);
      logado();
      conformidade();
      $state.go('multas');      
    };//fim do método multar


    $scope.vistoriar = function(){
    factoryLocaliza.localiza();
    $state.go('vistoria')

  }//fim do método vistoriar

    $scope.encerrar = function(){
      $state.go('login');
      ionic.Platform.exitApp();
    }

    $scope.solicitar = function(){
      $state.go('solicitacao');
    }

    $scope.visualisar = function(){
      $state.go('numero');
    }

    $scope.pesquisar = function(){
      var im = document.getElementById('im').value;
      var nome = document.getElementById('titular').value;
      if(im.length === 8 && nome.length > 0){
        inscricaofactory.set(im);
        $state.go('cuca');
      }else{
        alert('Busque a IM!');
      }
      
    }

}])

.controller('solicitacaoCtrl', ['$scope','$state', 'apoioFactory', function($scope, $state, apoioFactory){
  $scope.hora = ['','00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  $scope.bairros = ['','Abolição', 'Acari',' Água Santa', 'Alto da Boa Vista', 'Anchieta', 'Andaraí', 'Anil', 'Bancários', 'Bangu', 'Barra da Tijuca', 'Barra de Guaratiba', 'Barros Filho', 'Benfica', 'Bento Ribeiro', 'Bonsucesso', 'Botafogo', 'Brás de Pina', 'Cachambi', 'Cacuia', 'Caju','Camorim', 'Campinho', 'Campo dos Afonsos', 'Campo Grande', 'Cascadura', 'Catete', 'Catumbi', 'Cavalcanti', 'Centro', 'Cidade de Deus', 'Cidade Nova', 'Cidade Universitária', 'Cocotá', 'Coelho Neto', 'Colégio', 'Complexo do Alemão', 'Copacabana', 'Cordovil', 'Cosme Velho', 'Cosmos', 'Costa Barros', 'Curicica', 'Del Castilho', 'Deodoro', 'Encantado', 'Engenheiro Leal', 'Engenho da Rainha', 'Engenho de Dentro', 'Engenho Novo', 'Estácio', 'Flamengo', 'Freguesia - IG', 'Freguesia - JPG', 'Galeão', 'Gamboa', 'Gardênia Azul', 'Gávea', 'Gericinó', 'Glória', 'Grajaú', 'Grumari', 'Guadalupe', 'Guaratiba', 'Higienópolis', 'Honório Gurgel', 'Humaitá', 'Inhaúma', 'Inhoaíba', 'Ipanema', 'Irajá', 'Itanhangá', 'Jacaré', 'Jacarepaguá', 'Jacarezinho', 'Jardim América', 'Jardim Botânico', 'Jardim Carioca', 'Jardim Guanabara', 'Jardim Sulacap', 'Joá', 'kosmos', 'Lagoa', 'Lapa', 'Laranjeiras', 'Leblon', 'Leme', 'Lins de Vasconcelos', 'Madureira', 'Magalhães Bastos', 'Mangueira', 'Manguinhos', 'Maracanã', 'Maré', 'Marechal Hermes', 'Maria da Graça', 'Méier', 'Moneró', 'Olaria', 'Oswaldo Cruz', 'Paciência', 'Padre Miguel', 'Paquetá', 'Parada de Lucas', 'Parque Anchieta', 'Parque Columbia', 'Pavuna', 'Pechincha', 'Pedra de Guaratiba', 'Penha', 'Penha Circular', 'Piedade', 'Pilares', 'Pitangueiras', 'Portuguesa', 'Praça da Bandeira', 'Praça Seca', 'Praia da Bandeira', 'Quintino Bocaiúva', 'Ramos', 'Realengo', 'Recreio dos Bandeirantes', 'Riachuelo', 'Ribeira', 'Ricardo de Albuquerque', 'Rio Comprido', 'Rocha', 'Rocha Miranda', 'Rocinha', 'Sampaio', 'Santa Cruz', 'Santa Teresa', 'Santíssimo', 'Santo Cristo', 'São Conrado', 'São Cristóvão', 'São Francisco Xavier', 'Saúde', 'Senador Camará', 'Senador Vasconcelos', 'Sepetiba', 'Tanque', 'Taquara', 'Tauá', 'Tijuca', 'Todos os Santos', 'Tomás Coelho', 'Turiaçu', 'Urca', 'Vargem Grande', 'Vargem Pequena', 'Vasco da Gama', 'Vaz Lobo', 'Vicente de Carvalho', 'Vidigal', 'Vigário Geral', 'Vila Cosmos', 'Vila da Penha', 'Vila Isabel', 'Vila Militar', 'Vila Valqueire', 'Vista Alegre', 'Zumbi']
  $scope.motivos = ['', 'Notificação', 'Multa', 'Fisc. Autorizados', 'Desocupação', 'Ret. Equipametos']
  $scope.solicitaOpcoes = ['', 'limpar', 'escolher apoio', 'salvar', 'sair','inicio']
  $scope.showLimpar = false;
  $scope.showApoio = false;
  $scope.showInicio = false;
  $scope.showSalvar = false;
  $scope.showEncerrar = false;

  $scope.opcaoSolicitacao = function(){
    var opt = document.getElementById('solicitaOpcao').value
    if(opt.length > 1){
      if(opt === 'limpar'){
        $scope.showLimpar = true;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }else if(opt === 'escolher apoio'){
        $scope.showLimpar = false;
        $scope.showApoio = true;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }else if(opt === 'salvar'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = true;
        $scope.showEncerrar = false;
      }else if(opt === 'sair'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = true;
      }else if(opt === 'inicio'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = true;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }
    }else{
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
    }
  }

  function limpar(){
    document.getElementById('hora').selectedIndex = 0;
    document.getElementById('bairro').selectedIndex = 0;
    document.getElementById('motivo').selectedIndex = 0;
    document.getElementById('data').value = null;
    document.getElementById('ponto').value = null;
  }

  $scope.limpar = function(){
    limpar();
  }

  $scope.apoiar = function(){
    $state.go('apoio')
    apoioFactory.zeraPosicao();
  }

  $scope.iniciar = function(){
    $state.go('assentamento');
  }

  $scope.encerrar = function(){
      ionic.Platform.exitApp();
  }

  //document.getElementById('artigo').selectedIndex = 0;

}])

.controller('apoioCtrl', ['$scope', 'apoioFactory', '$state', function($scope, apoioFactory, $state){
  $scope.apoio = ['', 'AGENTE(S) GM', 'EQUIPE(S) GET', 'EQUIPE(S) GOE', 'PATRULHA(S) DA PMERJ', 'CAMINHÃO(ÕES) COMLURB + TRABALHADORES', 'EQUIPE(S) SECONSEVA + TRABALHADORES', 'RETROESCAVADEIRA(S)', 'EQUIPE(S) RIO-LUZ', 'EQUIPE(S) LIGTH', 'CAMINHÃO(ÕES) BAÚ', 'CAMINHÃO MUNCK', 'REBOQUE(S)', 'FAE(S)'];
  $scope.solicitacao = [];

  function limpar(){
    $scope.solicitacao = [];
  }

  function limpaBox(){
    document.getElementById('orgao').selectedIndex = 0;
    document.getElementById('quantidade').value = null;
  }
  
  $scope.add = function(){

    var apoio = document.getElementById("orgao").value
    var quantidade = document.getElementById('quantidade').value;
    if(apoio && quantidade){
      apoioFactory.setPosicao();
      var posicao = apoioFactory.getPosicao();
      $scope.solicitacao.push('0' + posicao + ') ' + quantidade + ' ' + apoio);
      apoioFactory.setApoio($scope.solicitacao.toString());
      console.log(apoioFactory.getApoio());
    }

    limpaBox();
    
  }

  $scope.clear = function(){
    limpar();
    limpaBox();
    apoioFactory.zeraPosicao();
  }

  $scope.save = function(){
    $state.go('solicitacao');
    limpar();
  }
  
  
}])

.factory('apoioFactory', [function(){
  var solicitacao = {};
  solicitacao.posicao = 0;


  var setApoio = function(value){
    return solicitacao.apoio = value;
  }

  var getApoio = function(){
    return solicitacao.apoio;
  }

  var setPosicao = function(){
    return solicitacao.posicao += 1; 
  }

  var getPosicao = function(){
    return solicitacao.posicao;
  }

  var zeraPosicao = function(){
    return solicitacao.posicao = 0;
  }



  return {
    setApoio: setApoio,
    getApoio: getApoio,
    setPosicao: setPosicao,
    getPosicao: getPosicao,
    zeraPosicao: zeraPosicao
  }

}])


.factory('factoryAgente', function(){
 
    var agente = {nome: '', matricula: '', ordem: 0, data: '', chefe: false};
     
    var get = function(){
      return agente;
    };

 

    var set = function(nome, matricula, ordem, data, chefe){
      return agente =  {nome: nome, matricula: matricula, ordem: ordem, data: data, chefe: chefe};
    };

     var getOrdem = function(){
      return agente.ordem;
    }

    var getChefe = function(){
      return agente.chefe;
    }

    return {
        get: get,
        set: set,
        getOrdem: getOrdem,
        getChefe: getChefe
    }
})

.factory('factoryAutorizado', ['$q', '$ionicLoading', function($q, $ionicLoading){
   var autorizado = 
    {
      nome: '', 
      matricula: '', 
      ordem: 0, 
      data: '',
      im: '',
      titular: '',
      preposto: '',
      cpf: '',
      local: '',
      situacao: '',
      conformidade: false,
      multas: '',
      latitude: '',
      longitude: '',
      horaAutuacao: '',
      pontos: 0
    }

    var setLatitude = function(value){
      return autorizado.latitude = value;
    }

    var setLongitude = function(value){
      return autorizado.longitude = value;
    }

    var sethoraAutuacao = function(value){
      return autorizado.horaAutuacao = value;
    }

    var setNome = function(value){
      return autorizado.nome = value;
    }

    var setMatricula = function(value){
      return autorizado.matricula = value;
    }

    var setOrdem = function(value){
      return autorizado.ordem = value;
    }

    var setData = function(value){
      return autorizado.data = value;
    }

    var extrair = function(value){
      return $q(function(resolve, reject){
        $ionicLoading.show({
          template: 'Buscando...'
        })

      $.ajax(
            {
                    url: 'http://scca.rio.rj.gov.br/index.php/online?im=' + value,
                    type: 'GET',
                    success: function(res)
                      {
                                var headline = $(res.responseText).text();
                                var regexTitular = /Nome(\D)+(\s)+Data/g;
                                var regexCPF = /CPF(\w)+/g;
                                var regexLocal = /Local(\D)+(nº)?/g;
                                var regexStatus = /Situa(.)+(\s)+TITULAR/g
                                var regexTuap = /[0-9]{2}-[0-9]{2}-[0-9]{4}[0-9]{2}-[0-9]{2}-[0-9]{4}/g
                                var nome = headline.match(regexTitular);
                                var cpfTitular = headline.match(regexCPF)
                                var localTitular = headline.match(regexLocal);
                                var statusTitular = headline.match(regexStatus);
                                var tuap = headline.match(regexTuap);
                                  if(nome){
                                      resolve($ionicLoading.hide())
                                      document.getElementById('titular').value = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var titular = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var cpf = cpfTitular[0].replace('CPF', '').trim();
                                      var local = localTitular[0].replace('Local', '').replace('nº', '').trim();
                                      var situacao = statusTitular[0].replace('Situação', '').replace('TITULAR', '').trim();
                                      
                                          if(nome[01]){
                                            var preposto =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                            set(value, titular, preposto, cpf, local, situacao,'');
                                          }else{
                                            var preposto = 'SEM PREPOSTO';
                                            set(value, titular, preposto, cpf, local, situacao, false);
                                          }

                                    }else{
                                      reject($ionicLoading.hide())
                                    }                                                           
                    }//fim do callback sucess
           });//fim do método ajax
        });//fim do $q
    }//fim mo método extrair


    var set = function(im, titular, preposto, cpf, local, situacao, conformidade){
      return autorizado =
      {
        nome: '',
        matricula: '',
        ordem: 0,
        data: '',
        im: im, 
        titular: titular, 
        preposto: preposto, 
        cpf: cpf, 
        local: local, 
        situacao: situacao, 
        conformidade: conformidade, 
        multas: '',
        latitude: '',
        longitude: '',
        horaAutuacao: '',
        pontos: 0
      }
    }

    var setPontos = function(value){
      autorizado.pontos = value;
    }

    var getPontos = function(){
      return autorizado.pontos;
    }

    var setEstado = function(value, nome, matricula, ordem, data){
      autorizado.conformidade = value;

    }

    var setMulta = function(value){
      var aux = get();
      return (aux.multas += value).trim();
    }

    var get = function(){
      return autorizado;
    }

    var getIM = function(){
      return autorizado.im;
    }

    var getStatus = function(){
      return autorizado.situacao;
    }

    return {
      get: get,
      set: set,
      setNome: setNome,
      setMatricula: setMatricula,
      setOrdem: setOrdem,
      setData: setData,
      extrair: extrair,
      setEstado: setEstado,
      setMulta: setMulta,
      getIM: getIM,
      getStatus: getStatus,
      setLatitude: setLatitude,
      setLongitude: setLongitude,
      sethoraAutuacao: sethoraAutuacao,
      getPontos: getPontos,
      setPontos: setPontos
    }

}]);

