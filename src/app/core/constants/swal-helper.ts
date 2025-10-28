import Swal, { SweetAlertIcon } from 'sweetalert2';

class SwalHelper {
  swalToast(arg0: string, arg1: string, arg2: string) {
    throw new Error('Method not implemented.');
  }
  public messageToast = async (message: string, icon: SweetAlertIcon) => {
    await Swal.fire({
      position: 'top-end',
      icon: icon,
      title: message,
      toast: true,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  public fire = async (
    title: string,
    message: string,
    icon: SweetAlertIcon
  ) => {
    await Swal.fire({
      title: title,
      text: message,
      icon: icon,
      draggable: true,
    });
  };

    public delete=async()=>{
   return Swal.fire({
      title: "De You really want to delete?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1cbb8c",
      cancelButtonColor: "#d64343",
      confirmButtonText: "Yes, delete it!"
    })
  }

  // public delete = async (icon: SweetAlertIcon) => {
  //  await Swal.fire({
  //     title: 'Are you really want to delete?',
  //     text: "You won't be able to revert this!",
  //     icon: icon,
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title: 'Deleted!',
  //         text: 'Your data has been deleted.',
  //         icon: 'success',
  //       });
  //     }
  //   });
  // };

  public success = async (message: string) => {
    await Swal.fire({
      icon: 'success',
      text: message,
      showConfirmButton: false,
      showCancelButton: false,
      timer: 1300,
    });
  };

  public warning = async (message: string) => {
    await Swal.fire({
      icon: 'warning',
      text: message,
      showConfirmButton: true,
      showCancelButton: false,
    });
  };

  public error = async (error: any) => {
    await Swal.fire({
      icon: 'error',
      text: error.message,
      showConfirmButton: true,
      showCancelButton: false,
    });
  };

  public confirmation = async (
    title: string,
    message: string,
    icon: SweetAlertIcon,
    buttons: any[] = ['Okay! Proceed', 'cancel']
  ) => {
    return Swal.fire({
      icon: icon,
      title: title,
      text: message,
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: buttons[0],
      cancelButtonText: buttons[1],
    });
  };

  public takeConfirmation = (
    title: string,
    text: string,
    confirmButtonText?: string
  ) => {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: confirmButtonText ?? 'Okay!',
    });
  };

  public showToast = async (message: string, icon: SweetAlertIcon) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    await Toast.fire({
      icon: icon,
      title: message
    });

  };
}

export let swalHelper = new SwalHelper();
