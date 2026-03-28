import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import AvailableArtClient from './AvailableArtClient';
import styles from './AvailableArt.module.css';

export const revalidate = 60;

export default async function AvailableArt() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawWorks: any[] = [];

    try {
        rawWorks = await client.fetch(
            `*[_type == "availableArt"] | order(status asc, _createdAt desc)[0...30]{ _id, title, image, description, size, category, status }`
        );
    } catch (error) {
        console.error("Sanity available art fetch failed:", error);
    }

    // Resolve image URLs server-side
    const works = (rawWorks || []).map((work) => {
        let imageUrl = '';
        try {
            if (work.image) {
                imageUrl = urlForImage(work.image).url();
            }
        } catch {
            console.error(`Failed to resolve image for art ${work._id}`);
        }
        return {
            _id: work._id,
            title: work.title || '',
            imageUrl,
            description: work.description,
            size: work.size,
            category: work.category,
            status: work.status || 'disponivel',
        };
    }).filter((w) => w.imageUrl); // Only show items with valid images

    return (
        <section id="artes-disponiveis" className={styles.section}>
            <div className="container">
                <span className="section-subtitle">Pronta para Tatuar</span>
                <h2 className="section-title">Artes Disponíveis</h2>

                <AvailableArtClient works={works} />
            </div>
        </section>
    );
}
