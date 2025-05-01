import { Announcement } from "@/types/announcement.types";

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Summer Sale 2023",
    description: "Biggest sale of the year starting soon",
    url: "https://example.com/broken-image1.jpg", // Broken image
    created_at: "2023-05-15T09:30:00+07:00",
    start_date: "2023-06-01T00:00:00+07:00",
    end_date: "2023-06-30T23:59:59+07:00",
  },
  {
    id: "2",
    title: "New Product Launch",
    description: "Check out our revolutionary new product",
    url: "https://picsum.photos/600/400", // Random real image
    created_at: "2023-04-20T14:15:00+07:00",
    start_date: "2023-05-01T08:00:00+07:00",
    end_date: "2023-05-31T20:00:00+07:00",
  },
  {
    id: "3",
    title: "System Maintenance",
    description: "Planned downtime for system upgrades",
    url: "https://example.com/nonexistent-image.png", // Broken image
    created_at: "2023-03-10T11:00:00+07:00",
    start_date: "2023-03-15T22:00:00+07:00",
    end_date: "2023-03-16T06:00:00+07:00",
  },
  {
    id: "4",
    title: "Annual Conference",
    description: "Join us for our biggest event of the year",
    url: "https://source.unsplash.com/random/600x400", // Random real image
    created_at: "2023-02-28T16:45:00+07:00",
    start_date: "2023-04-10T09:00:00+07:00",
    end_date: "2023-04-12T18:00:00+07:00",
  },
  {
    id: "5",
    title: "Holiday Schedule",
    description: "Our operating hours during the holiday season",
    url: "https://placekitten.com/600/400", // Random real image (kittens!)
    created_at: "2022-12-01T10:20:00+07:00",
    start_date: "2022-12-20T00:00:00+07:00",
    end_date: "2023-01-05T00:00:00+07:00",
  },
  {
    id: "6",
    title: "Mobile App Update",
    description: "New features available in our mobile application",
    url: "https://broken-domain.example/image.jpg", // Broken image
    created_at: "2023-01-15T13:10:00+07:00",
    start_date: "2023-01-20T00:00:00+07:00",
    end_date: "2023-02-28T23:59:59+07:00",
  },
  {
    id: "7",
    title: "Community Event",
    description: "Participate in our annual charity run",
    url: "https://loremflickr.com/600/400/event", // Random real image
    created_at: "2023-03-05T08:30:00+07:00",
    start_date: "2023-04-22T06:00:00+07:00",
    end_date: "2023-04-22T12:00:00+07:00",
  },
  {
    id: "8",
    title: "Website Redesign",
    description: "Our new look is coming soon",
    url: "https://example.com/missing-image.jpeg", // Broken image
    created_at: "2023-02-10T15:00:00+07:00",
    start_date: "2023-03-01T00:00:00+07:00",
    end_date: "2023-03-31T23:59:59+07:00",
  },
  {
    id: "9",
    title: "Customer Appreciation",
    description: "Special discounts for our loyal customers",
    url: "https://placebear.com/600/400", // Random real image (bears!)
    created_at: "2023-01-05T11:25:00+07:00",
    start_date: "2023-01-15T00:00:00+07:00",
    end_date: "2023-01-31T23:59:59+07:00",
  },
  {
    id: "10",
    title: "Partnership Announcement",
    description:
      "Exciting news about our new strategic partnership with [Partner Name] some text again.",
    url: "https://dummyimage.com/600x400/000/fff", // Random real image (placeholder)
    created_at: "2023-04-01T09:45:00+07:00",
    start_date: "2023-04-10T00:00:00+07:00",
    end_date: "2023-05-10T00:00:00+07:00",
  },
];
