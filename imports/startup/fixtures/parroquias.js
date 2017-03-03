import { Parroquias } from '../../api/parroquias';

var i, len, parroquia, parroquias;

if (Parroquias.find().count() === 0) {
  if (false) {
    parroquias = [
      {
        name: 'Nuestra Senora de la Misericorda',
        description: 'Dan misas y confiezan'
      }, {
        name: 'La iglesia de San Pedro',
        description: 'Dan seminarios, misas y casan a personas'
      }, {
        name: 'La iglesia de Senecu',
        description: 'Dan alabanzas al senior'
      }
    ];
    for (i = 0, len = parroquias.length; i < len; i++) {
      parroquia = parroquias[i];
      Parroquias.insert(parroquia);
    }
  }
}
