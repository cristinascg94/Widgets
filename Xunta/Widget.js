define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/QueryTask","esri/tasks/query", "dojo/_base/lang", "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleFillSymbol"],
function(declare, BaseWidget, QueryTask, Query, lang, SpatialReference, Graphic, SimpleFillSymbol) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    cargaConcellos: function () {
      let codigoProvincia = this.selectProvincias.value;
      if (codigoProvincia == -1) return;
      this.selectConcellos.innerHTML = "";
      
      // configurar consulta concellos
      const queryTask = new QueryTask(this.config.concellosService);
      const query = new Query ();
      query.returnGeometry = false;
      query.outFields = ["CODCONC","CONCELLO"];
      query.orderByFields = ["CONCELLO"];
      query.where = "CODPROV = " + codigoProvincia;

      queryTask.execute(query, lang.hitch(this, function(results){
        let opt = document.createElement("option");
        opt.value = -1;
        opt.text = "Seleccione concello";
        this.selectConcellos.add(opt);
        for (let i = 0; i < results.features.length; i++){
          opt = document.createElement("option");
          opt.value = results.features[i].attributes.CODCONC;
          opt.text = results.features[i].attributes.CONCELLO;
          this.selectConcellos.add(opt);
        };
      }));
      
       

    },

    cargaParroquias: function(){

      let codigoParroquias = this.selectParroquias.value;
      if (codigoParroquias == -1) return;
      this.selectParroquias.innerHTML = "";
       // configurar consulta Parroquias

       queryTask = new QueryTask(this.config.ParroquiasService);
       const query = new Query ();
       query.returnGeometry = false;
       query.outFields = ["CODPARRO","PARROQUIA"];
       query.orderByFields = ["PARROQUIA"];
       query.where = "CODCONC = " + this.selectConcellos.value;

       queryTask.execute(query, lang.hitch(this, function(results){
         let opt = document.createElement("option");
         opt.value = -1;
         opt.text = "Seleccione Parroquia";
         this.selectParroquias.add(opt);

         for (let i = 0; i < results.features.length; i++){
           opt = document.createElement("option");
           opt.value = results.features[i].attributes.CODPARRO;
           opt.text = results.features[i].attributes.PARROQUIA;
           this.selectParroquias.add(opt);
         };
       }));

    },

      zoomConcello: function(){

        let codigoConcello = this.selectConcellos.value;
      if (codigoConcello == -1) return;

      var queryTask = new QueryTask(this.config.concellosService);
      const query = new Query ();
      query.returnGeometry = true;
      query.outSpatialReference = new SpatialReference(102100);
      query.where = "CODCONC = " + codigoConcello;
      console.log(query);

      queryTask.execute(query, lang.hitch(this, function(results){
        if (results.features.length > 0){
          var geometria = results.features[0].geometry;
          this.map.graphics.clear ();
          this.map.graphics.add(new Graphic(geometria, new SimpleFillSymbol()));
          this.map.setExtent(geometria.getExtent(), true);
        }
      }));

      },

      zoomParroquia: function(){
        let codigoParroquias = this.selectParroquias.value;
        if (codigoParroquias == -1) return;

      var queryTask = new QueryTask(this.config.ParroquiasService);
      const query = new Query ();
      query.returnGeometry = true;
      query.outSpatialReference = new SpatialReference(102100);
      query.where = "CODPARRO = " + codigoParroquias;
      console.log(query);

      queryTask.execute(query, lang.hitch(this, function(results){
        if (results.features.length > 0){
          var geometria = results.features[0].geometry;
          this.map.graphics.clear ();
          this.map.graphics.add(new Graphic(geometria, new SimpleFillSymbol()));
          this.map.setExtent(geometria.getExtent(), true);
        }
      }));
      },

    // Custom widget code goes here

    baseClass: 'xunta',
    

  });

});
