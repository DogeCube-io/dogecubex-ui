import type {
    ChartData, ChartMetaInfo, IExternalSaveLoadAdapter, StudyTemplateData, StudyTemplateMetaInfo
} from "../../public/charting_library";

export type DrawingTemplate = {
    name: string;
    toolName: string;
    content: string;
}

class TVSaveLoadAdapter implements IExternalSaveLoadAdapter {
    static KEY_CHARTS = "d3x.tv_saved_charts";
    static KEY_TEMPLATES = "d3x.tv_saved_study_templates";
    static KEY_DRAWING = "d3x.tv_saved_drawing_templates";

    private idSequence = Date.now();
    private _currentSymbol: string;

    constructor(currentSymbol: string) {
        this._currentSymbol = currentSymbol;
    }

    private _getAllCharts(): ChartMetaInfo[] {
        const charts = localStorage[TVSaveLoadAdapter.KEY_CHARTS] || "";
        if (charts) {
            return JSON.parse(charts);
        }
        return [];
    }

    private _saveAllCharts(charts: ChartMetaInfo[]): void {
        localStorage[TVSaveLoadAdapter.KEY_CHARTS] = JSON.stringify(charts);
    }

    getAllCharts(): Promise<ChartMetaInfo[]> {
        return Promise.resolve(this._getAllCharts());
    }

    removeChart<T extends number | string>(id: T): Promise<void> {
        const charts = this._getAllCharts();
        for (let i = 0; i < charts.length; ++i) {
            if (charts[i].id === id) {
                charts.splice(i, 1);
                this._saveAllCharts(charts);
                return Promise.resolve();
            }
        }

        return Promise.reject();
    }

    saveChart(chartData: ChartData): Promise<string> {
        const charts = this._getAllCharts();

        if (!chartData.id) {
            chartData.id = this.idSequence.toString();
            this.idSequence++;
        } else {
            for (let i = 0; i < charts.length; ++i) {
                if (charts[i].id.toString() === chartData.id.toString()) {
                    charts.splice(i, 1);
                    break;
                }
            }
        }
        (<ChartMetaInfo><any>chartData).timestamp = Date.now();
        charts.push(<ChartMetaInfo><any>chartData);

        this._saveAllCharts(charts);
        return Promise.resolve(chartData.id);
    }

    getChartContent(chartId: number): Promise<string> {
        const charts = this._getAllCharts();
        for (const item of charts) {
            if (item.id.toString() === chartId.toString()) {
                let contentRaw = (<ChartData><any>item).content;

                if (item.symbol !== this._currentSymbol) {
                    // fix the symbol
                    const content = JSON.parse(contentRaw);

                    content.symbol = this._currentSymbol;
                    content.short_name = this._currentSymbol;
                    const chartsSymbols = JSON.parse(content.charts_symbols);
                    for (const id in chartsSymbols) {
                        chartsSymbols[id].symbol = this._currentSymbol;
                    }
                    content.charts_symbols = JSON.stringify(chartsSymbols);

                    const legs = JSON.parse(content.legs);
                    for (const id in legs) {
                        legs[id].symbol = this._currentSymbol;
                        legs[id].pro_symbol = this._currentSymbol;
                    }
                    content.legs = JSON.stringify(legs);

                    const innerContent = JSON.parse(content.content);
                    for (const i in innerContent.charts) {
                        for (const j in innerContent.charts[i].panes) {
                            for (const k in innerContent.charts[i].panes[j].sources) {
                                innerContent.charts[i].panes[j].sources[k].state.symbol = this._currentSymbol;
                                innerContent.charts[i].panes[j].sources[k].state.shortName = this._currentSymbol;
                            }
                        }
                    }
                    content.content = JSON.stringify(innerContent);
                    contentRaw = JSON.stringify(content);
                }

                return Promise.resolve(contentRaw);
            }
        }

        console.error('error');
        return Promise.reject();
    }

    private _getAllTemplates(): StudyTemplateData[] {
        const templates = localStorage[TVSaveLoadAdapter.KEY_TEMPLATES] || "";
        if (templates) {
            return JSON.parse(templates);
        }
        return [];
    }

    private _saveAllTemplates(templates: StudyTemplateData[]): void {
        localStorage[TVSaveLoadAdapter.KEY_TEMPLATES] = JSON.stringify(templates);
    }


    getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
        return Promise.resolve(this._getAllTemplates());
    }

    removeStudyTemplate(studyTemplateInfo: StudyTemplateMetaInfo): Promise<void> {
        const templates = this._getAllTemplates();
        for (let i = 0; i < templates.length; i++) {
            if (templates[i].name === studyTemplateInfo.name) {
                templates.splice(i, 1);
                this._saveAllTemplates(templates);
                return Promise.resolve();
            }
        }

        return Promise.reject();
    }

    saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void> {
        const templates = this._getAllTemplates();
        for (let i = 0; i < templates.length; ++i) {
            if (templates[i].name === studyTemplateData.name) {
                templates.splice(i, 1);
                break;
            }
        }

        templates.push(studyTemplateData);
        this._saveAllTemplates(templates);
        return Promise.resolve();
    }

    getStudyTemplateContent(studyTemplateInfo: StudyTemplateMetaInfo): Promise<string> {
        const templates = this._getAllTemplates();
        for (const item of templates) {
            if (item.name === studyTemplateInfo.name) {
                return Promise.resolve(item.content);
            }
        }

        console.error('st: error');
        return Promise.reject();
    }

    private _getAllDrawing(): DrawingTemplate[] {
        const templates = localStorage[TVSaveLoadAdapter.KEY_DRAWING] || "";
        if (templates) {
            return JSON.parse(templates);
        }
        return [];
    }

    private _saveAllDrawing(templates: DrawingTemplate[]): void {
        localStorage[TVSaveLoadAdapter.KEY_DRAWING] = JSON.stringify(templates);
    }

    getDrawingTemplates(toolName: string): Promise<string[]> {
        const templates = this._getAllDrawing();
        return Promise.resolve(templates.filter(t => !t.toolName || t.toolName === toolName).map(t => t.name));
    }

    removeDrawingTemplate(toolName: string, templateName: string): Promise<void> {
        const templates = this._getAllDrawing();
        for (let i = 0; i < templates.length; i++) {
            if (templates[i].name === templateName) {
                templates.splice(i, 1);
                this._saveAllDrawing(templates);
                return Promise.resolve();
            }
        }

        return Promise.reject();
    }

    saveDrawingTemplate(toolName: string, templateName: string, content: string): Promise<void> {
        const templates = this._getAllDrawing();
        for (let i = 0; i < templates.length; ++i) {
            if (templates[i].name === templateName) {
                templates.splice(i, 1);
                break;
            }
        }

        templates.push({name: templateName, toolName: toolName, content: content});
        this._saveAllDrawing(templates);
        return Promise.resolve();
    }

    loadDrawingTemplate(toolName: string, templateName: string): Promise<string> {
        const templates = this._getAllDrawing();
        for (let i = 0; i < templates.length; ++i) {
            if (templates[i].name === templateName) {
                return Promise.resolve(templates[i].content);
            }
        }

        console.error('drawing: error');
        return Promise.reject();
    }


    set currentSymbol(value: string) {
        this._currentSymbol = value;
    }
}

export default TVSaveLoadAdapter;
