#me acabo de poner a pensar que quisa mas bien deveriamos
#de llamarlas iglesias XD haha hace mas sentido
if Parroquias.find().count() == 0
  parroquias = [
    {
      name: 'Nuestra Senora de la Misericorda'
      description: 'Dan misas y confiezan'
    }
    {
      name: 'La iglesia de San Pedro'
      description: 'Dan seminarios, misas y casan a personas'
    }
    {
      name: 'La iglesia de Senecu'
      description: 'Dan alabanzas al senior'
    }
  ]

  Parroquias.insert parroquia for parroquia in parroquias
