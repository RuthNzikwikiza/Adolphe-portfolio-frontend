import ListManager from '../../components/ListManager';
import SingletonEditor from '../../components/SingletonEditor';
import type { Field, Row } from '../../components/fields';
import { formatDate } from '../../text';

function str(value: Row[string] | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function img(value: Row[string] | undefined): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

const pressFields: Field[] = [
  { kind: 'text', name: 'outlet', label: 'Outlet', required: true, maxLength: 120, half: true },
  { kind: 'date', name: 'date', label: 'Date', required: true, half: true },
  { kind: 'text', name: 'headline', label: 'Headline', required: true, maxLength: 255 },
  { kind: 'url', name: 'url', label: 'Link to the article (optional)', placeholder: 'https://' },
  { kind: 'textarea', name: 'summary', label: 'Summary (optional)', rows: 4 },
  { kind: 'image', name: 'image', altName: 'image_alt', label: 'Picture (optional)' },
];

const projectFields: Field[] = [
  { kind: 'text', name: 'title', label: 'Title', required: true, maxLength: 120, half: true },
  { kind: 'text', name: 'year', label: 'Year', required: true, maxLength: 10, half: true, hint: 'For example 2026, or 2024-2026.' },
  { kind: 'textarea', name: 'description', label: 'Description (optional)', rows: 5 },
  { kind: 'url', name: 'link', label: 'Project website (optional)', placeholder: 'https://' },
  { kind: 'image', name: 'image', altName: 'image_alt', label: 'Picture (optional)' },
];

const accoladeFields: Field[] = [
  { kind: 'number', name: 'year', label: 'Year', required: true, half: true, placeholder: '2026' },
  { kind: 'text', name: 'issuer', label: 'Given by', required: true, maxLength: 200, half: true },
  { kind: 'text', name: 'title', label: 'Award or recognition', required: true, maxLength: 200 },
  { kind: 'textarea', name: 'description', label: 'Description (optional)', rows: 4 },
  { kind: 'image', name: 'image', altName: 'image_alt', label: 'Picture (optional)' },
];

const galleryFields: Field[] = [
  { kind: 'image', name: 'image', altName: 'alt', label: 'Photo', required: true },
  { kind: 'text', name: 'caption', label: 'Caption (optional)', maxLength: 200 },
];

const factFields: Field[] = [
  { kind: 'text', name: 'label', label: 'Label', required: true, maxLength: 60, half: true, hint: 'For example Based in.' },
  { kind: 'text', name: 'value', label: 'Value', required: true, maxLength: 200, half: true, hint: 'For example Kigali, Rwanda.' },
];

const educationFields: Field[] = [
  { kind: 'text', name: 'title', label: 'Qualification', required: true, maxLength: 200 },
  { kind: 'text', name: 'institution', label: 'Institution (optional)', maxLength: 200 },
  { kind: 'textarea', name: 'description', label: 'Description (optional)', rows: 5 },
];

const socialFields: Field[] = [
  { kind: 'text', name: 'label', label: 'Name', required: true, maxLength: 60, half: true, hint: 'For example LinkedIn.' },
  { kind: 'url', name: 'url', label: 'Link', required: true, half: true, placeholder: 'https://' },
];

const homeFields: Field[] = [
  { kind: 'heading', label: 'Top of the page' },
  { kind: 'image', name: 'hero_image', label: 'Main photo' },
  { kind: 'text', name: 'name', label: 'Name', required: true, maxLength: 120, half: true },
  { kind: 'text', name: 'tag', label: 'Small label', required: true, maxLength: 60, half: true },
  { kind: 'text', name: 'eyebrow', label: 'Tagline', required: true, maxLength: 80 },
  { kind: 'heading', label: 'Introduction' },
  { kind: 'text', name: 'intro_heading', label: 'Heading', required: true, maxLength: 200 },
  { kind: 'textarea', name: 'intro_text', label: 'Text', required: true, rows: 7, hint: 'Leave a blank line between paragraphs.' },
  { kind: 'heading', label: 'Featured project' },
  { kind: 'text', name: 'featured_title', label: 'Title', required: true, maxLength: 120, half: true },
  { kind: 'text', name: 'featured_year', label: 'Year', required: true, maxLength: 10, half: true },
  { kind: 'textarea', name: 'featured_description', label: 'Description (optional)', rows: 4 },
  { kind: 'image', name: 'featured_image', altName: 'featured_image_alt', label: 'Project picture (optional)' },
];

const aboutFields: Field[] = [
  { kind: 'image', name: 'portrait', altName: 'portrait_alt', label: 'Portrait (optional)' },
  { kind: 'text', name: 'heading', label: 'Page heading', required: true, maxLength: 120 },
  { kind: 'textarea', name: 'bio', label: 'Biography', required: true, rows: 8, hint: 'Leave a blank line between paragraphs.' },
  { kind: 'textarea', name: 'approach', label: 'My approach (optional)', rows: 6, hint: 'Leave a blank line between paragraphs.' },
  { kind: 'textarea', name: 'education_intro', label: 'Education introduction (optional)', rows: 3 },
];

const contactFields: Field[] = [
  { kind: 'text', name: 'heading', label: 'Page heading', required: true, maxLength: 120 },
  { kind: 'textarea', name: 'intro', label: 'Introduction', required: true, rows: 4, hint: 'Leave a blank line between paragraphs.' },
  { kind: 'email', name: 'email', label: 'Email (messages are sent here)', half: true },
  { kind: 'text', name: 'phone', label: 'Phone (optional)', maxLength: 40, half: true },
  { kind: 'text', name: 'location', label: 'Based in (optional)', maxLength: 120 },
];

export function PressManager() {
  return (
    <ListManager
      title="Press"
      intro="Articles and interviews. The newest appear first on the site."
      resource="press"
      noun="article"
      addLabel="Add an article"
      emptyText="No articles yet. Add the first one."
      fields={pressFields}
      thumbnails
      describe={(item) => ({
        title: str(item.headline),
        subtitle: `${str(item.outlet)} - ${formatDate(str(item.date))}`,
        image: img(item.image),
      })}
    />
  );
}

export function WorkManager() {
  return (
    <ListManager
      title="Work"
      intro="Projects shown on the Work page. Use Up and Down to change the order."
      resource="projects"
      noun="project"
      addLabel="Add a project"
      emptyText="No projects yet. Add the first one."
      fields={projectFields}
      reorderable
      thumbnails
      describe={(item) => ({ title: str(item.title), subtitle: str(item.year), image: img(item.image) })}
    />
  );
}

export function AccoladesManager() {
  return (
    <ListManager
      title="Accolades"
      intro="Awards and recognition. The site groups them by year, newest first."
      resource="accolades"
      noun="accolade"
      addLabel="Add an accolade"
      emptyText="No accolades yet. Add the first one."
      fields={accoladeFields}
      thumbnails
      describe={(item) => ({
        title: str(item.title),
        subtitle: `${str(item.year)} - ${str(item.issuer)}`,
        image: img(item.image),
      })}
    />
  );
}

export function GalleryManager() {
  return (
    <ListManager
      title="Gallery"
      intro="Photos shown on the Gallery page. Use Up and Down to change the order."
      resource="gallery"
      noun="photo"
      addLabel="Add a photo"
      emptyText="No photos yet. Add the first one."
      fields={galleryFields}
      reorderable
      thumbnails
      describe={(item) => ({
        title: str(item.caption) || str(item.alt),
        subtitle: str(item.caption) ? str(item.alt) : '',
        image: img(item.image),
      })}
    />
  );
}

export function FactsManager() {
  return (
    <ListManager
      title="About: at a glance"
      intro="The short facts beside the portrait on the About page."
      resource="facts"
      noun="fact"
      addLabel="Add a fact"
      emptyText="No facts yet. Add the first one."
      fields={factFields}
      reorderable
      describe={(item) => ({ title: str(item.label), subtitle: str(item.value) })}
    />
  );
}

export function EducationManager() {
  return (
    <ListManager
      title="About: education"
      intro="Qualifications listed at the bottom of the About page."
      resource="education"
      noun="entry"
      addLabel="Add an entry"
      emptyText="No education entries yet. Add the first one."
      fields={educationFields}
      reorderable
      describe={(item) => ({ title: str(item.title), subtitle: str(item.institution) })}
    />
  );
}

export function SocialsManager() {
  return (
    <ListManager
      title="Contact: social links"
      intro="Links shown as buttons on the Contact page."
      resource="socials"
      noun="link"
      addLabel="Add a link"
      emptyText="No links yet. Add the first one."
      fields={socialFields}
      reorderable
      describe={(item) => ({ title: str(item.label), subtitle: str(item.url) })}
    />
  );
}

export function HomeEditor() {
  return (
    <SingletonEditor
      title="Home page"
      intro="The text and pictures at the top of the site."
      resource="home"
      viewPath="/"
      fields={homeFields}
    />
  );
}

export function AboutEditor() {
  return (
    <SingletonEditor
      title="About page"
      intro="The portrait and biography. Facts and education have their own sections."
      resource="about"
      viewPath="/about"
      fields={aboutFields}
    />
  );
}

export function ContactEditor() {
  return (
    <SingletonEditor
      title="Contact page"
      intro="Contact details. Messages from the form are emailed to the address below."
      resource="contact"
      viewPath="/contact"
      fields={contactFields}
    />
  );
}
