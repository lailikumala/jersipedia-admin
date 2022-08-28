import FIREBASE from "../firebase";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../../utils";
import Swal from "sweetalert2";

export const GET_LIST_JERSEY = "GET_LIST_JERSEY";
export const UPLOAD_JERSEY = "UPLOAD_JERSEY";
export const TAMBAH_JERSEY = "TAMBAH_JERSEY";
export const GET_DETAIL_JERSEY = "GET_DETAIL_JERSEY";
export const UPDATE_JERSEY = "UPDATE_JERSEY";
export const DELETE_JERSEY = "DELETE_JERSEY";

export const getListJersey = () => dispatch => {
  //loading
    dispatchLoading(dispatch, GET_LIST_JERSEY);

  return FIREBASE.database()
    .ref("jerseys")
    .once("value", (querySnapshot) => {
      //Hasil
      let data = querySnapshot.val();
      dispatchSuccess(dispatch, GET_LIST_JERSEY, data);
    })
    .catch((error) => {
      dispatchError(dispatch, GET_LIST_JERSEY, error);
      alert(error);
    });
};

export const getDetailJersey = (id) => dispatch => {
  //loading
    dispatchLoading(dispatch, GET_DETAIL_JERSEY);

  return FIREBASE.database()
    .ref("jerseys/" + id)
    .once("value", (querySnapshot) => {
      //Hasil
      let data = querySnapshot.val();
      dispatchSuccess(dispatch, GET_DETAIL_JERSEY, data);
    })
    .catch((error) => {
      dispatchError(dispatch, GET_DETAIL_JERSEY, error);
      alert(error);
    });
};

export const uploadJersey = (gambar, imageToDB) => dispatch => {
  //loading
    dispatchLoading(dispatch, UPLOAD_JERSEY);
console.log("dari action", imageToDB)
    // upload ke storage firebase
    var uploadTask = FIREBASE.storage()
      .ref("jerseys")
      .child(gambar.name)
      .put(gambar);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        dispatchError(dispatch, UPLOAD_JERSEY, error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const dataBaru = {
            image: downloadURL,
            imageToDB: imageToDB,
          };
          dispatchSuccess(dispatch, UPLOAD_JERSEY, dataBaru);
          Swal.fire({
            title: "Sukses",
            text: "Jersey Sukses Diupload",
            icon: "success",
            confirmButtonText: "OK",
          })
        });
      }
    );
};

export const tambahJersey = (data, history) => dispatch => {
  //loading
    dispatchLoading(dispatch, TAMBAH_JERSEY);

    const dataBaru = {
      nama: data.nama,
      harga: data.harga,
      berat: data.berat,
      jenis: data.jenis,
      ready: data.ready,
      ukuran: data.ukuranSelected,
      liga: data.liga,
      gambar: [data.imageToDB1, data.imageToDB2],
    };
    
    return FIREBASE.database()
      .ref("jerseys")
      .push(dataBaru)
      .then((response) => {
        dispatchSuccess(dispatch, TAMBAH_JERSEY, response);
        Swal.fire({
          title: "Sukses",
          text: "Jersey Sukses Dibuat",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          history.push("/admin/jersey");
        })
      })
      .catch((error) => {
        dispatchError(dispatch, TAMBAH_JERSEY, error);
        alert(error);
      });
};

export const updateJersey = (data, history) => dispatch => {
  //loading
    dispatchLoading(dispatch, UPDATE_JERSEY);

    const dataBaru = {
      gambar: [
        data.imageToDB1 ? data.imageToDB1 : data.imageLama1,
        data.imageToDB2 ? data.imageToDB2 : data.imageLama2,
      ],
      nama: data.nama,
      harga: data.harga,
      berat: data.berat,
      jenis: data.jenis,
      ready: data.ready,
      ukuran: data.ukuranSelected,
      liga: data.liga,
    };

    return FIREBASE.database()
      .ref("jerseys/"+data.id)
      .update(dataBaru)
      .then((response) => {

        if(data.imageToDB1) {
          var desertRef = FIREBASE.storage().refFromURL(data.imageLama1);
          desertRef
            .delete()
            .catch((error) => {
              dispatchError(dispatch, UPDATE_JERSEY, error);
            })
        }

        if(data.imageToDB2) {
          var desertRef2 = FIREBASE.storage().refFromURL(data.imageLama2);
          desertRef2
            .delete()
            .catch((error) => {
              dispatchError(dispatch, UPDATE_JERSEY, error);
            })
        }
        dispatchSuccess(dispatch, UPDATE_JERSEY, "Update Jersey Sukses");
        Swal.fire({
          title: "Sukses",
          text: "Update Jersey Sukses",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          history.push("/admin/jersey");
        })
      })
      .catch((error) => {
        dispatchError(dispatch, UPDATE_JERSEY, error);
        alert(error);
      });
};

export const deleteJersey = (images, id) => dispatch => {
  //loading
    dispatchLoading(dispatch, DELETE_JERSEY);

    var desertRef = FIREBASE.storage().refFromURL(images[0]);
    desertRef
      .delete()
      .then(() => {
        var desertRef2 = FIREBASE.storage().refFromURL(images[1]);
        desertRef2
          .delete()
          .then(() => {

            //hapus realtime database
            return FIREBASE.database().ref('jerseys/'+id).remove()
              .then(() => {
                dispatchSuccess(dispatch, DELETE_JERSEY, "Jersey Berhasil di Hapus")
                Swal.fire({
                  title: "Sukses",
                  text: "Jersey Berhasil di Hapus",
                  icon: "success",
                  confirmButtonText: "OK",
                })
              })
              .catch( (error) => {
                dispatchError(dispatch, DELETE_JERSEY, error);
              })
          })
          .catch((error) => {
            dispatchError(dispatch, DELETE_JERSEY, error);
          })
      })
      .catch((error) => {
        dispatchError(dispatch, DELETE_JERSEY, error);
      })
}
