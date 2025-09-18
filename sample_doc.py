# sample_doc.py - create a test text file for ingestion

content = """WebsiteOS is a cultural ecosystem steward that manages
narratives, data, and cultural flows.

Qdrant is a vector database optimized for semantic search
and storing embeddings.

OpenAI embeddings transform text into dense vector representations,
making it possible to search by meaning instead of keywords."""

with open("sample_doc.txt", "w", encoding="utf-8") as f:
    f.write(content)

print("✅ Created sample_doc.txt in current folder")
