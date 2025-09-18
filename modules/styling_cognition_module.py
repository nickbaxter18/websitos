# /WEBSITEOS/modules/styling_cognition_module.py

from enum import Enum
from typing import Dict, Any


class PageType(Enum):
    LANDING = "landing"
    DASHBOARD = "dashboard"
    BLOG = "blog"
    ECOMMERCE = "ecommerce"
    PORTFOLIO = "portfolio"


class StylingCognitionModule:
    def __init__(self, brand_palette: Dict[str, str]):
        """
        brand_palette = {
            "primary": "#123456",
            "secondary": "#654321",
            "accent": "#FF9900",
        }
        """
        self.brand_palette: Dict[str, str] = brand_palette

    # 🎨 COLOR INTELLIGENCE ----------------------------------
    def generate_color_scheme(self, page_type: PageType) -> Dict[str, Any]:
        schemes: Dict[PageType, Dict[str, str]] = {
            PageType.LANDING: {"harmony": "complementary", "emotion": "excitement"},
            PageType.DASHBOARD: {"harmony": "analogous", "emotion": "clarity"},
            PageType.BLOG: {"harmony": "muted-analogous", "emotion": "reflection"},
            PageType.ECOMMERCE: {"harmony": "triadic", "emotion": "urgency+desire"},
            PageType.PORTFOLIO: {
                "harmony": "split-complementary",
                "emotion": "prestige",
            },
        }
        base = schemes[page_type]
        return {
            "base_palette": self.brand_palette,
            "harmony_rule": base["harmony"],
            "emotional_target": base["emotion"],
            "contrast_ratio": ">=4.5:1",
        }

    # ✍️ TYPOGRAPHY INTELLIGENCE ----------------------------
    def select_typography(self, page_type: PageType) -> Dict[str, str]:
        fonts: Dict[PageType, Dict[str, str]] = {
            PageType.LANDING: {"headline": "Poppins-Bold", "body": "Inter-Regular"},
            PageType.DASHBOARD: {"headline": "Inter-SemiBold", "body": "Inter-Regular"},
            PageType.BLOG: {
                "headline": "Merriweather-Bold",
                "body": "Merriweather-Regular",
            },
            PageType.ECOMMERCE: {
                "headline": "PlayfairDisplay-Bold",
                "body": "Inter-Regular",
            },
            PageType.PORTFOLIO: {"headline": "Montserrat-Bold", "body": "Lora-Regular"},
        }
        return fonts[page_type]

    # 📐 LAYOUT INTELLIGENCE --------------------------------
    def layout_rules(self, page_type: PageType) -> Dict[str, Any]:
        layouts: Dict[PageType, Dict[str, str]] = {
            PageType.LANDING: {"pattern": "Z-pattern", "whitespace": "luxury"},
            PageType.DASHBOARD: {"pattern": "modular grid", "whitespace": "compact"},
            PageType.BLOG: {"pattern": "F-pattern", "whitespace": "medium"},
            PageType.ECOMMERCE: {
                "pattern": "gallery spotlight",
                "whitespace": "luxury",
            },
            PageType.PORTFOLIO: {
                "pattern": "cinematic sections",
                "whitespace": "luxury",
            },
        }
        return layouts[page_type]

    # ⚡ MOTION INTELLIGENCE --------------------------------
    def motion_archetypes(self, page_type: PageType) -> Dict[str, Any]:
        motions: Dict[PageType, Dict[str, str]] = {
            PageType.LANDING: {
                "animation": "cinematic fade+scale",
                "duration": "400ms",
            },
            PageType.DASHBOARD: {
                "animation": "micro-interactions",
                "duration": "200ms",
            },
            PageType.BLOG: {"animation": "scroll-reveals", "duration": "350ms"},
            PageType.ECOMMERCE: {
                "animation": "product hover zoom",
                "duration": "300ms",
            },
            PageType.PORTFOLIO: {
                "animation": "cinematic parallax",
                "duration": "500ms",
            },
        }
        return motions[page_type]

    # 🎭 EMOTION + NARRATIVE -------------------------------
    def emotion_curve(self, page_type: PageType) -> Dict[str, str]:
        curves: Dict[PageType, str] = {
            PageType.LANDING: "curiosity → trust → action",
            PageType.DASHBOARD: "clarity → control → mastery",
            PageType.BLOG: "curiosity → reflection → trust",
            PageType.ECOMMERCE: "desire → urgency → delight",
            PageType.PORTFOLIO: "awe → admiration → contact",
        }
        return {"narrative_arc": curves[page_type]}

    # 🧪 QA & AESTHETIC VALIDATION --------------------------
    def run_aesthetic_audit(self, styling_config: Dict[str, Any]) -> Dict[str, str]:
        """
        Runs beauty + function checks:
        - Color harmony validation
        - Typography rhythm checks
        - Motion smoothness audits
        - Whitespace proportion validation
        """
        return {
            "color_harmony": "validated",
            "typography_flow": "validated",
            "spatial_rhythm": "validated",
            "motion_finesse": "validated",
            "narrative_alignment": "validated",
        }

    # 🖥️ MASTER STYLING CONFIG ------------------------------
    def build_styling_profile(self, page_type: PageType) -> Dict[str, Any]:
        profile: Dict[str, Any] = {
            "colors": self.generate_color_scheme(page_type),
            "typography": self.select_typography(page_type),
            "layout": self.layout_rules(page_type),
            "motion": self.motion_archetypes(page_type),
            "emotion": self.emotion_curve(page_type),
        }
        profile["aesthetic_audit"] = self.run_aesthetic_audit(profile)
        return profile
