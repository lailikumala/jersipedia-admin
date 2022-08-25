import FIREBASE from '../firebase';
import {dispatchError, dispatchLoading, dispatchSuccess} from '../../utils';
import Swal from 'sweetalert2';

export const GET_LIST_LIGA = 'GET_LIST_LIGA';
export const GET_DETAIL_LIGA = 'GET_DETAIL_LIGA';
export const TAMBAH_LIGA = "TAMBAH_LIGA";
export const UPDATE_LIGA = "UPDATE_LIGA";
export const DELETE_LIGA = "DELETE_LIGA";

export const getListLiga = () => dispatch => {
  //loading
    dispatchLoading(dispatch, GET_LIST_LIGA);

    return FIREBASE.database()
      .ref('ligas')
      .once('value', (querySnapshot) => {
        //Hasil
        let data = querySnapshot.val();
        dispatchSuccess(dispatch, GET_LIST_LIGA, data);
      })
      .catch((error) => {
        dispatchError(dispatch, GET_LIST_LIGA, error);
        alert(error);
      });
};

export const getDetailLiga = (id) => dispatch => {
  //loading
    dispatchLoading(dispatch, GET_DETAIL_LIGA);

    return FIREBASE.database()
      .ref('ligas/'+id)
      .once('value', (querySnapshot) => {
        //Hasil
        let data = querySnapshot.val();
        dispatchSuccess(dispatch, GET_DETAIL_LIGA, data);
      })
      .catch((error) => {
        dispatchError(dispatch, GET_DETAIL_LIGA, error);
        alert(error);
      });
};

export const tambahLiga = (data, history) => dispatch => {
  //loading
    dispatchLoading(dispatch, TAMBAH_LIGA);

    //upload ke storage firebase
    var uploadTask = FIREBASE.storage()
      .ref("ligas")
      .child(data.imageToDB.name)
      .put(data.imageToDB);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const dataBaru = {
            namaLiga: data.namaLiga,
            image: downloadURL,
          };

        return FIREBASE.database()
            .ref("ligas")
            .push(dataBaru)
            .then((response) => {
              dispatchSuccess(dispatch, TAMBAH_LIGA, response ? response : []);
              Swal.fire({
                title: "Sukses",
                text: "Liga Sukses Dibuat",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                history.push("/admin/liga");
              })
            })
            .catch((error) => {
              dispatchError(dispatch, TAMBAH_LIGA, error);
              alert(error);
            });
        });
      }
    );
};

export const updateLiga = (data, history) => dispatch => {
  //loading
    dispatchLoading(dispatch, UPDATE_LIGA);
  console.log("dataaaaa", data)
    //Cek apakah gambar diganti
    if (data.imageToDB) {
      //ambil file gambar lama dari firebase storage
      var desertRef = FIREBASE.storage().refFromURL(data.imageLama);

      // hapus gambar lama dari firebase storage
      desertRef
        .delete()
        .then(() => {
          //upload gambar yang baru
          var uploadTask = FIREBASE.storage()
            .ref("ligas")
            .child(data.imageToDB.name)
            .put(data.imageToDB);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              console.log(snapshot);
            },
            (error) => {
              console.log(error);
            },
            () => {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  const dataBaru = {
                    namaLiga: data.namaLiga,
                    image: downloadURL,
                  };

              return FIREBASE.database()
                .ref("ligas/" + data.id)
                .update(dataBaru)
                .then((response) => {
                  dispatchSuccess(dispatch, UPDATE_LIGA, response ? response : []);
                  Swal.fire({
                    title: "Sukses",
                    text: "Liga Sukses Diupdate",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    history.push("/admin/liga");
                  })
                })
                .catch((error) => {
                  dispatchError(dispatch, UPDATE_LIGA, error);
                  alert(error);
                });
              });
            }
          );
        })
        .catch((error) => {
          dispatchError(dispatch, UPDATE_LIGA, error);
          alert(error);
        });
    } else {
      const dataBaru = {
        namaLiga: data.namaLiga,
        image: data.image,
      };

      return FIREBASE.database()
        .ref("ligas/" + data.id)
        .update(dataBaru)
        .then((response) => {
          dispatchSuccess(dispatch, UPDATE_LIGA, response ? response : []);
          Swal.fire({
            title: "Sukses",
            text: "Liga Sukses Diupdate",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            history.push("/admin/liga");
          })
        })
        .catch((error) => {
          dispatchError(dispatch, UPDATE_LIGA, error);
          alert(error);
        });
    }
};

export const deleteLiga = (image, id) => dispatch => {
  //loading
    dispatchLoading(dispatch, DELETE_LIGA);

    //Hapus gambar dari storage
    var desertRef = FIREBASE.storage().refFromURL(image);

    // Delete the file
    desertRef
      .delete()
      .then(() => {
        //hapus juga data di realtime database
        return FIREBASE.database()
          .ref("ligas/" + id)
          .remove()
          .then(() => {
            dispatchSuccess(dispatch, DELETE_LIGA, "Liga Sukses Dihapus");
            Swal.fire({
              title: "Sukses",
              text: "Liga Sukses Dihapus",
              icon: "success",
              confirmButtonText: "OK",
            })
          })
          .catch((error) => {
            dispatchError(dispatch, DELETE_LIGA, error);
            alert(error);
          });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        dispatchError(dispatch, DELETE_LIGA, error);
        alert(error);
      });
};