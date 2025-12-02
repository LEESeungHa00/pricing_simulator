# 🚀 Pricing Simulator

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-FF6384?logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Lucide React](https://img.shields.io/badge/Lucide_Icons-0.344-F78C6C?logo=lucide&logoColor=white)](https://lucide.dev/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini_API-Flash_2.5-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![XLSX](https://img.shields.io/badge/SheetJS-0.18.5-217346?logo=microsoftexcel&logoColor=white)](https://sheetjs.com/)

> **B2B 파트너십 수익성 시뮬레이션 및 동적 견적 산출 솔루션** > 고객사 데이터 기반의 수익 모델링, AI 전략 수립, 이격률 분석을 통한 최적의 제안서 생성을 지원합니다.

---

## 🛠 Tech Stack (기술 스택)

| Category | Technology | Usage & Features |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | [cite_start]컴포넌트 기반 UI 아키텍처, `useState`, `useMemo`를 활용한 상태 관리|
| **Styling** | **Tailwind CSS** | [cite_start]유틸리티 퍼스트 CSS를 통한 반응형 레이아웃 및 디자인 시스템 적용 |
| **Visualization** | **Recharts** | [cite_start]시뮬레이션 결과(Base vs Success) 및 비교 차트 시각화 |
| **Icons** | **Lucide React** | [cite_start]직관적인 UX를 위한 SVG 아이콘 시스템 |
| **Data Processing** | **SheetJS (XLSX)** | [cite_start]클라이언트 사이드 엑셀 파일 파싱 및 데이터 전처리|
| **AI Integration** | **Google Gemini API** | [cite_start]`gemini-2.5-flash` 모델을 활용한 전략 어드바이저 및 제안서 자동 생성 |

---

## 📑 목차 (Table of Contents)
1. [기능 기획서 (Functional Specification)](#1-기능-기획서-functional-specification)
2. [사용자 매뉴얼 (User Manual)](#2-사용자-매뉴얼-user-manual)
3. [주요 성과 지표 (Key Metrics)](#3-주요-성과-지표-key-metrics)
4. [핵심 계산 로직 (Calculation Logic)](#4-핵심-계산-로직-calculation-logic)

---

# 1. 기능 기획서 (Functional Specification)

### 1.1. 기획 배경 및 목적
* [cite_start]**Standardization**: 영업 사원별 상이한 견적 산출 방식을 통일하고, `CSV Quota`, `User Seat` 등 과금 요소를 표준화함[cite: 171, 179].
* [cite_start]**Profitability**: 단순 고정비 모델에서 벗어나, 고객 유형(`CUSTOMER_TYPES`)과 성향에 맞춘 성과 기반(Commission) 모델 도입[cite: 3, 63].
* [cite_start]**Intelligence**: AI(`Gemini`)를 활용하여 고객 상황에 맞는 모델 추천 및 설득 논리 자동 생성[cite: 59, 61].

### 1.2. 핵심 프로세스 (Core Process)
[cite_start]시스템은 3단계 흐름(`Quote` -> `Modeling` -> `Verification`)으로 구성됩니다[cite: 13].

| Step | 프로세스명 | 주요 기능 |
| :---: | :--- | :--- |
| **01** | **Standard Pricing** | [cite_start]고객 유형 진단(Quiz), 목표 설정, 동적 견적 산출 [cite: 33, 112] |
| **02** | **Modeling** | [cite_start]품목별 전략 매핑, 5가지 모델(A~E) 비교 시뮬레이션, AI 전략 자문 [cite: 115, 204] |
| **03** | **Verification** | [cite_start]엑셀 데이터 분석, Z-Score 이격률 산출, 최종 계약서 요약 [cite: 117, 355] |

---

# 2. 사용자 매뉴얼 (User Manual)

### [STEP 1] 표준 견적 산출 (Quote)
고객사의 유형을 정의하고 표준 가격(Standard Price)을 확정하는 단계입니다.

1.  **고객 유형 진단 (Diagnosis)**
    * [cite_start]화면 좌측 퀴즈에 답변하여 6가지 유형(A: 완제품 수입, C: 외자 제조 등) 중 하나를 도출합니다[cite: 3, 119].
2.  **목표 설정 (Objectives)**
    * [cite_start]`원가 절감`, `리스크 관리` 등 목표 선택 시 필요한 기능(Factors) 및 범위(Scope)가 자동 설정됩니다[cite: 9, 136].
3.  **옵션 및 기간 조정**
    * [cite_start]사용자 수(`Users`) 및 데이터 쿼터(`CSV Slider`)를 조정합니다[cite: 167, 171].
    * [cite_start]계약 기간(1~3년)을 선택하여 장기 계약 할인율을 적용합니다[cite: 181].
4.  **견적 확정**
    * [cite_start]우측 패널에서 총 계약 금액(`Total Contract Value`) 확인 후 **[모델링 이어서 하기]** 클릭[cite: 191].

### [STEP 2] 시뮬레이션 조건 모델링 (Modeling)
초기 비용 부담을 줄이고 상호 이익을 극대화할 수 있는 과금 모델을 설계합니다.

1.  **AI 전략 어드바이저 (Gemini)**
    * [cite_start]입력창에 고객 상황(예: "신규 진입이라 초기 비용 부담 큼") 입력 후 **[조언 구하기]** 클릭[cite: 197, 201].
    * [cite_start]AI가 제안하는 최적 모델과 설득 논리(Selling Point)를 확인합니다[cite: 209].
2.  **품목 전략 매핑**
    * [cite_start]고객 취급 품목(국제 시세 연동형, 계절성 등)을 선택하여 추천 모델(`Recommended`) 태그를 확인합니다[cite: 69, 223].
3.  **모델 시뮬레이션**
    * [cite_start]5가지 모델(A~E) 버튼을 클릭하여 비용 구조 차트(Base vs Success) 변화를 관찰합니다[cite: 239, 260].
    * [cite_start]`고객 ROI`와 `예상 순이익(Benefit)`이 최적인 모델을 선정합니다[cite: 248, 257].

### [STEP 3] 최적 파트너십 검증 (Verification)
실제 데이터를 기반으로 제안 타당성을 검증합니다.

1.  **데이터 업로드**
    * [cite_start]고객 수입 실적 엑셀(`.xlsx`, `.csv`) 파일을 업로드합니다[cite: 287].
    * [cite_start]분석할 `Importer`(기업명)와 `Year`(기준/평가 연도)를 선택합니다[cite: 290, 291].
2.  **분석 모드 선택**
    * [cite_start]**Standard Mode**: 단순 평균 단가 차이를 이용한 일반적인 절감액 산출[cite: 298].
    * [cite_start]**Advanced Mode**: 시장 변동성(표준편차)을 고려한 `Z-Score` 이격률 분석 (변동성이 큰 품목에 권장)[cite: 302].
3.  **최종 제안서 생성**
    * [cite_start]**[AI 제안서 생성]** 버튼을 클릭하여, 시뮬레이션 결과가 반영된 `Executive Summary`를 생성합니다[cite: 341].

---

# 3. 주요 성과 지표 (Key Metrics)

| Metric (지표) | Icon | Description (설명) | Formula / Logic | Source |
| :--- | :---: | :--- | :--- | :--- |
| **ROI**<br>(투자 수익률) | 📈 | 총 비용 대비 고객의 순이익 비율 | [cite_start]`(NetBenefit / TotalCost) * 100` | [cite: 75] |
| **Net Benefit**<br>(고객 순이익) | 💰 | 절감액에서 비용을 제외한 현금 확보액 | [cite_start]`Savings - (BaseFee + SuccessFee)` | [cite: 74] |
| **Contract Value**<br>(총 계약 규모) | 🤝 | 당사의 총 기대 매출 (기간 포함) | [cite_start]`AnnualPrice * DurationMultiplier` | [cite: 33] |
| **Z-Score Diff**<br>($\Delta Z$) | 🎯 | 시장 변동성 대비 성과 개선도 | [cite_start]`Z_base - Z_eval` | [cite: 80] |
| **CAP Usage**<br>(상한 도달) | 🚨 | 성과보수 상한선 도달 여부 | [cite_start]`SuccessFee > (StdPrice * 3)` | [cite: 74] |

---

# 4. 핵심 계산 로직 (Calculation Logic)

### A. 표준 계약 금액 (Standard Price)
[cite_start]기본 플랫폼 비용에 옵션 비용 합산 및 기간 할인 적용[cite: 23, 30, 31].

* **Base Components**: Platform($5,000) + User($1,000/인) + Quota(구간별 차등)
* **Options**:
    * Scope: Standard(+$2k), Unlimited(+$5k), Vertical(-30% DC)
    * Features: Tridge EYE(+$10k), Objective Factors(+$2k~$5k)
* **Duration Discount**: 2년(10% 할인), 3년(17% 할인)

### B. 파트너십 모델 구조 (Fee Structure)
[cite_start]표준 가격(Standard Price) 기준 고정비와 성과보수 비율[cite: 63, 64, 65, 66, 67, 68].

| Model | Type | Base Rate (고정비) | Success Rate (성과요율) | Risk |
| :--- | :--- | :---: | :---: | :---: |
| **A** | 안정 추구형 | **80%** | **10%** | Low |
| **B** | 균형 제안형 | **60%** | **20%** | Medium |
| **C** | 성과 집중형 | **30%** | **40%** | High |
| **D** | 성과 극대화형 | **10%** | **50%** | Very High |
| **E** | 선지급 확정형 | **100%** | **0%** | Zero |

### C. 성과보수 상한선 (CAP Policy)
[cite_start]과도한 수수료 청구를 방지하기 위한 안전 장치[cite: 74, 76].

> ⚠️ **CAP Rule**: 성과보수는 **표준 계약 금액(Standard Price)의 300% (3배)**를 초과할 수 없음.

```math
\text{Final Success Fee} = \min(\text{Calculated Fee}, \text{Standard Price} \times 3)
