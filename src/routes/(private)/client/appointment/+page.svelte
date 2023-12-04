<script>
  // @ts-nocheck
  import { jsPDF } from "jspdf";
  import html2canvas from "html2canvas";
  import { goto } from "$app/navigation";
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";
  import Status from "$lib/components/Status.svelte";

  import {
    IconCalendar,
    IconEye,
    IconEyeClosed,
    IconPdf,
    IconTrash,
  } from "@tabler/icons-svelte";

  import QrCode from "svelte-qrcode";

  import moment from "moment";

  import { onMount } from "svelte";
  import settingStore from "$lib/stores/setting.store";
  import { getQrUrl } from "$lib/string";

  let loading = false;

  let content;

  let items = [];

  let appointment = {};

  let modal;

  const onAddNew = () => {
    goto("/client/appointment/create");
  };

  const onCancel = async () => {
    const conf = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (conf) {
      await fetch("/client/appointment/cancel", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          appointment,
        }),
      })
        .then(() => {
          alert("appointment was successfully cancelled");
          loadAppointments();
          modal.close();
          appointment = {};
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    }
  };

  const onPrint = () => {
    const width = content.offsetWidth;
    const height = content.offsetHeight;
    const ratio = height / width;
    html2canvas(content, { width, height }).then((canvas) => {
      var image = canvas.toDataURL("image/png");
      var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      height = ratio * width;
      doc.addImage(image, "JPEG", 0, 0, width, height);
      doc.save("myPage.pdf"); //Download the rendered PDF.
    });
    // Create a new jsPDF instance
  };

  const onView = (item) => {
    modal.showModal();
    appointment = item;
  };

  const loadAppointments = async () => {
    const response = await fetch("/client/appointment/index", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const { data } = await response.json();

    items = data;
  };

  onMount(() => loadAppointments());

  $: console.log(appointment);

  $: setting = $settingStore.common;
</script>

<PageMain {loading}>
  <PageHead
    title="Upcoming Appointments"
    subtitle="Please make sure that you bring necessary documents during your appointments."
    on:add={onAddNew}
  />
  {#if items.length > 0}
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <td />
            <td>Appointment Code</td>
            <td class="hidden lg:table-cell">Contact</td>
            <td class="hidden sm:table-cell">Status</td>
            <td />
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          {#each items as item}
            <!-- content here -->
            <tr>
              <td style="min-width: 180px;">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="text-lg text-primary font-bold cursor-pointer"
                  on:click={() => onView(item)}
                >
                  {item.service}
                  <div class="font-normal text-xs text-gray-500">
                    {moment(item.datetime).format("LLL")}
                  </div>
                </div>
              </td>
              <td class="uppercase font-bold text-lg">
                {item.code}
              </td>
              <td style="min-width: 200px;" class="hidden lg:table-cell">
                {item.name} <br /> {item.contact}</td
              >
              <td class="hidden sm:table-cell">
                <Status status={item.status} />
              </td>
              <td class="text-right">
                <button
                  class="btn btn-square text-white btn-success btn-sm"
                  on:click={() => onView(item)}
                >
                  <IconEye size={16} />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="p-6 border flex items-center mt-6 h-96 justify-center">
      <div
        class="text-lg font-bold flex justify-center flex-col items-center gap-6"
      >
        <div class="text-center">
          <IconCalendar size={100} />
        </div>
        You do not have any appointments yet.
      </div>
    </div>
  {/if}
</PageMain>

<dialog bind:this={modal} class="modal">
  {#if appointment}
    <div class="modal-box">
      <div class="flex flex-col px-4" bind:this={content}>
        <div class="flex items-center flex-col gap-2 mb-4">
          <img src={setting.logo} alt="Logo" class="w-24" />
          <div class="text-xl font-bold">{setting.name}, {setting.city}</div>
        </div>

        <div class="flex items-center justify-center py-8">
          <QrCode value={getQrUrl(appointment.id)} />
        </div>

        <div class="flex items-center mb-6">
          <div class="flex flex-col gap-1` flex-1">
            <div class="text-gray-500 text-xs font-bold uppercase">Name</div>
            <div>{appointment.name}</div>
          </div>
          <div class="flex flex-col gap-1` flex-1">
            <div class="text-gray-500 text-xs font-bold uppercase">
              Appointment Date
            </div>
            <div>
              {moment(appointment.datetime).format("LLL")}
            </div>
          </div>
        </div>

        <div class="flex items-center mb-8">
          <div class="flex flex-col gap-1` flex-1">
            <div class="text-gray-500 text-xs font-bold uppercase">Service</div>
            <div>{appointment.service}</div>
          </div>
          <div class="flex flex-col gap-1` flex-1">
            <div class="text-gray-500 text-xs font-bold uppercase">
              Appointment Code
            </div>
            <div class="font-bold uppercase">
              {appointment.code}
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4">
        <button
          class="btn text-white btn-primary btn-sm"
          on:click={() => onPrint(appointment)}
        >
          <IconPdf size={16} /> Download
        </button>

        <button
          disabled={appointment.status !== "pending"}
          class="btn text-white btn-error btn-sm"
          on:click={() => onCancel(appointment)}
        >
          <IconTrash size={16} /> Cancel
        </button>

        <button
          class="btn text-white btn-warning btn-sm"
          on:click={() => modal.close()}
        >
          <IconEyeClosed size={16} /> Close
        </button>
      </div>
    </div>
  {/if}
</dialog>
