Halo Gemini,

Tolong buatkan struktur file CRUD lengkap untuk fitur [Nama Fitur] dalam aplikasi Vue.js saya. Saya menggunakan arsitektur bersih dengan tiga lapisan utama: Domain, Data, dan Presentation.

Gunakan pola kode yang sudah kita terapkan (Pinia store, Use Cases, Repository pattern dengan Either, if (result.right) di store, FormData untuk file, dll.).

Struktur File yang Diharapkan:

domain:

entities/EventEntity.js

repository/IEventRepository.js

use-case/CreateEventUseCase.js

use-case/GetEventsUseCase.js

use-case/GetEventByIdUseCase.js

use-case/UpdateEventUseCase.js

use-case/UpdateEventStatusUseCase.js

use-case/DeleteEventUseCase.js

data:

model/EventResponseModel.js

source/EventRemoteSource.js

repository/EventRepository.js

presentation:

stores/useEventStore.js

pages/EventPage.vue

components/EventFormModal.vue

Berikut adalah spesifikasi API dan detail presentasi untuk fitur [Nama Fitur]:

1. Spesifikasi API
Get All
Endpoint: {{BASE_URL}}/event

Contoh Respons Sukses (JSON):

{
    "status_code": 200,
    "message": "Events Retrieved Successfully",
    "data": [
        {
            "id": "e7c97f5a-5cfb-4c6b-b25a-4ff900912847",
            "name": "Grand Opening",
            "type_event": "BUNDLE",
            "start_date": "2025-10-04T00:00:00Z",
            "end_date": "2025-10-10T00:00:00Z",
            "cover": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1759935208/nusantara_service/events/nusantara_service/events/event_e7c97f5a-5cfb-4c6b-b25a-4ff900912847_cover.png",
            "status": 1,
            "event_product": null,
            "event_bundle_buy": [
                {
                    "id": "02afc278-a145-4151-862d-441acd93e18c",
                    "event": "Grand Opening",
                    "product": {
                        "id": "595ac43c-301c-40d0-a3c3-6aa3990c984b",
                        "name": "Bolu Meranti Keju lumer",
                        "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755216112/nusantara_service/product/nusantara_service/product/cover_bolu-meranti-keju.png.png",
                        "code": "BLM-K-001",
                        "price": 85000,
                        "unit": "kotak",
                        "description": "Bolu gulung lembut khas Medan...",
                        "status": 1,
                        "type_product": "Minuman",
                        "product_images": [
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755216112/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_0.png.png",
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755962419/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_1.png.png",
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755962418/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_2.png.png"
                        ],
                        "created_by": "Superadmin",
                        "created_at": "2025-08-23T15:22:30.549957Z",
                        "updated_at": "2025-08-24T01:58:05.538639Z",
                        "deleted_at": null
                    },
                    "quantity": 1,
                    "created_at": "2025-10-04T14:04:04.70799Z",
                    "updated_at": "2025-10-04T14:04:04.70799Z",
                    "deleted_at": null
                }
            ],
            "event_bundle_reward": [
                {
                    "id": "1e42e7fc-e641-4951-8324-3f161ae8b707",
                    "event": "Grand Opening",
                    "product": {
                        "id": "6a960118-d871-44e2-bddd-8283763f4137",
                        "name": "Red Velvet",
                        "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756025158/nusantara_service/product/nusantara_service/product/cover_red-velvet.png.png",
                        "code": "RV",
                        "price": 55000,
                        "unit": "Kotak",
                        "description": "Red Velvet",
                        "status": 1,
                        "type_product": "Bolu",
                        "product_images": [],
                        "created_by": "super Admin2",
                        "created_at": "2025-08-24T08:45:58.868594Z",
                        "updated_at": "2025-08-24T08:45:58.868594Z",
                        "deleted_at": null
                    },
                    "quantity": 1,
                    "created_at": "2025-10-08T15:46:07.952474Z",
                    "updated_at": "2025-10-08T15:46:07.952474Z",
                    "deleted_at": null
                },
                {
                    "id": "18f500b7-9256-41fe-956d-d31dec4ff37f",
                    "event": "Grand Opening",
                    "product": {
                        "id": "84b93557-1259-4f56-a25e-a1ecad19ab66",
                        "name": "tas spunbond menara",
                        "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037299/nusantara_service/product/nusantara_service/product/cover_tas-spunbond-menara.png.png",
                        "code": "TSM",
                        "price": 2500,
                        "unit": "PIECES",
                        "description": "tas spunbond menara",
                        "status": 1,
                        "type_product": "Pancake",
                        "product_images": [
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037626/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_0.png.png",
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037630/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_1.png.png",
                            "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037626/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_2.png.png"
                        ],
                        "created_by": "super Admin2",
                        "created_at": "2025-08-24T12:06:57.480037Z",
                        "updated_at": "2025-09-11T12:37:42.478507Z",
                        "deleted_at": null
                    },
                    "quantity": 2,
                    "created_at": "2025-10-08T15:46:07.952474Z",
                    "updated_at": "2025-10-08T15:46:07.952474Z",
                    "deleted_at": null
                }
            ],
            "created_by": "Superadmin",
            "created_at": "2025-10-04T14:03:56.963395Z",
            "updated_at": "2025-10-08T15:46:08.177352Z",
            "deleted_at": null
        }
    ],
    "pagination": {
        "current_page": 1,
        "per_page": 10,
        "total_data": 1,
        "total_pages": 1
    }
}

Get By ID
Endpoint: {{BASE_URL}}/event/:id

Contoh Respons Sukses (JSON):

{
    "status_code": 200,
    "message": "Event Retrieved Successfully",
    "data": {
        "id": "e7c97f5a-5cfb-4c6b-b25a-4ff900912847",
        "name": "Grand Opening",
        "type_event": "BUNDLE",
        "start_date": "2025-10-04T00:00:00Z",
        "end_date": "2025-10-10T00:00:00Z",
        "cover": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1759935208/nusantara_service/events/nusantara_service/events/event_e7c97f5a-5cfb-4c6b-b25a-4ff900912847_cover.png",
        "status": 1,
        "event_product": null,
        "event_bundle_buy": [
            {
                "id": "02afc278-a145-4151-862d-441acd93e18c",
                "event": "Grand Opening",
                "product": {
                    "id": "595ac43c-301c-40d0-a3c3-6aa3990c984b",
                    "name": "Bolu Meranti Keju lumer",
                    "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755216112/nusantara_service/product/nusantara_service/product/cover_bolu-meranti-keju.png.png",
                    "code": "BLM-K-001",
                    "price": 85000,
                    "unit": "kotak",
                    "description": "Bolu gulung lembut khas Medan...",
                    "status": 1,
                    "type_product": "Minuman",
                    "product_images": [
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755216112/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_0.png.png",
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755962419/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_1.png.png",
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1755962418/nusantara_service/product/nusantara_service/product/gallery_bolu-meranti-keju_2.png.png"
                    ],
                    "created_by": "Superadmin",
                    "created_at": "2025-08-23T15:22:30.549957Z",
                    "updated_at": "2025-08-24T01:58:05.538639Z",
                    "deleted_at": null
                },
                "quantity": 1,
                "created_at": "2025-10-04T14:04:04.70799Z",
                "updated_at": "2025-10-04T14:04:04.70799Z",
                "deleted_at": null
            }
        ],
        "event_bundle_reward": [
            {
                "id": "1e42e7fc-e641-4951-8324-3f161ae8b707",
                "event": "Grand Opening",
                "product": {
                    "id": "6a960118-d871-44e2-bddd-8283763f4137",
                    "name": "Red Velvet",
                    "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756025158/nusantara_service/product/nusantara_service/product/cover_red-velvet.png.png",
                    "code": "RV",
                    "price": 55000,
                    "unit": "Kotak",
                    "description": "Red Velvet",
                    "status": 1,
                    "type_product": "Bolu",
                    "product_images": [],
                    "created_by": "super Admin2",
                    "created_at": "2025-08-24T08:45:58.868594Z",
                    "updated_at": "2025-08-24T08:45:58.868594Z",
                    "deleted_at": null
                },
                "quantity": 1,
                "created_at": "2025-10-08T15:46:07.952474Z",
                "updated_at": "2025-10-08T15:46:07.952474Z",
                "deleted_at": null
            },
            {
                "id": "18f500b7-9256-41fe-956d-d31dec4ff37f",
                "event": "Grand Opening",
                "product": {
                    "id": "84b93557-1259-4f56-a25e-a1ecad19ab66",
                    "name": "tas spunbond menara",
                    "image": "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037299/nusantara_service/product/nusantara_service/product/cover_tas-spunbond-menara.png.png",
                    "code": "TSM",
                    "price": 2500,
                    "unit": "PIECES",
                    "description": "tas spunbond menara",
                    "status": 1,
                    "type_product": "Pancake",
                    "product_images": [
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037626/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_0.png.png",
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037630/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_1.png.png",
                        "https://res.cloudinary.com/dwdwa65i4/image/upload/v1756037626/nusantara_service/product/nusantara_service/product/gallery_tas-spunbond-menara_2.png.png"
                    ],
                    "created_by": "super Admin2",
                    "created_at": "2025-08-24T12:06:57.480037Z",
                    "updated_at": "2025-09-11T12:37:42.478507Z",
                    "deleted_at": null
                },
                "quantity": 2,
                "created_at": "2025-10-08T15:46:07.952474Z",
                "updated_at": "2025-10-08T15:46:07.952474Z",
                "deleted_at": null
            }
        ],
        "created_by": "Superadmin",
        "created_at": "2025-10-04T14:03:56.963395Z",
        "updated_at": "2025-10-08T15:46:08.177352Z",
        "deleted_at": null
    }
}

Create
Endpoint: {{BASE_URL}}/event/create

Metode: POST, Tipe Body: form-data

Contoh Payload:

name:Opening Toko
start_date:2025-10-04T00:00:00Z
end_date:2025-10-10T00:00:00Z
type_event:BUNDLE
cover: file.png
status:0
event_bundle_buys:[{↵  "product_id": "595ac43c-301c-40d0-a3c3-6aa3990c984b",↵  "quantity": 1↵}]
event_bundle_rewards:[{↵  "product_id": "6a960118-d871-44e2-bddd-8283763f4137",↵  "quantity": 1↵}]

Update
Endpoint: {{BASE_URL}}/event/:id/edit

Metode: POST (dengan _method: 'PUT'), Tipe Body: form-data

Contoh Payload:

name:Grand Opening
new_cover : file.png
event_bundle_rewards:[↵{↵  "product_id": "6a960118-d871-44e2-bddd-8283763f4137",↵  "quantity": 1↵},↵{↵  "product_id": "84b93557-1259-4f56-a25e-a1ecad19ab66",↵  "quantity": 2↵},↵]
type_event:BUNDLE

Update Status
Endpoint: {{BASE_URL}}/event/:id/edit-status

Metode: PUT, Tipe Body: JSON

Contoh Request Body:

{ "status": 0 }
atau 
{
    "status" : 1
}

Delete
Endpoint: {{BASE_URL}}/event/:id/delete

Metode: DELETE
dan ini responnya 
{
    "status_code": 200,
    "message": "Event deleted successfully"
}


<!-- 2. Detail Lapisan Presentation
Tampilan Daftar: Gunakan desain [Kartu (Card)].

Informasi di Kartu: Tampilkan [nama, gambar cover, tanggal, dll.].

Aksi: Sediakan tombol Edit, Hapus, dan Ubah Status (StatusToggleDropdown).

Form Modal: Buat sebagai form multi-langkah (wizard) jika kompleks. -->

3. Instruksi Tambahan
Pastikan untuk melakukan mapping snake_case dari API ke camelCase di Entity.

Gunakan FormData untuk request create dan update yang melibatkan file.

Terima kasih!