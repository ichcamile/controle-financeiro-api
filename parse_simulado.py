import re

with open('/Users/mile/Documents/controle-financeiro/simulado-2.sql', 'r', encoding='utf-8') as f:
    text = f.read()

parts = re.split(r'(?m)^Pergunta (\d+)$', text)

output_md = "# Resultados Simulado 2 - AWS AI Practitioner\n\n"
output_md += "> Arquivo de revisão do simulado 2. Aqui você encontra a pergunta, as alternativas, quais você escolheu e quais eram as corretas.\n\n"

for idx in range(1, len(parts), 2):
    q_num = parts[idx]
    q_body = parts[idx+1].strip().split('\n')
    
    outcome = q_body[0].strip() # "Correto" or "Incorreto"
    
    explicacao_indices = [i for i, line in enumerate(q_body) if line.strip() == "Explicação"]
    
    alternatives = []
    
    for i, exp_idx in enumerate(explicacao_indices):
        alt_text = q_body[exp_idx - 1].strip()
        
        modifier_idx = exp_idx - 2
        user_selected = False
        is_correct = False
        
        while modifier_idx >= 0:
            mod_line = q_body[modifier_idx].strip()
            if not mod_line:
                modifier_idx -= 1
                continue
            if "Sua seleção" in mod_line or "Sua resposta" in mod_line:
                user_selected = True
                if "correta" in mod_line.lower():
                    is_correct = True
            elif "Resposta correta" in mod_line or "Seleção correta" in mod_line:
                is_correct = True
            elif "Incorreto." in mod_line or "Correto." in mod_line:
                break
            else:
                break
            modifier_idx -= 1
            
        exp_text = q_body[exp_idx + 1].strip() if exp_idx + 1 < len(q_body) else ""
        if exp_text.startswith("Correto."):
            is_correct = True
            
        alternatives.append({
            'text': alt_text,
            'user_selected': user_selected,
            'is_correct': is_correct,
            'explanation': exp_text
        })
        
    first_exp_idx = explicacao_indices[0] if explicacao_indices else len(q_body)
    first_alt_idx = first_exp_idx - 1
    mod_idx = first_alt_idx - 1
    while mod_idx >= 1:
        mod_line = q_body[mod_idx].strip()
        if "Sua seleção" in mod_line or "Sua resposta" in mod_line or "Resposta correta" in mod_line or "Seleção correta" in mod_line:
            first_alt_idx = mod_idx
            mod_idx -= 1
        elif not mod_line:
            mod_idx -= 1
        else:
            break
            
    question_lines = q_body[1:first_alt_idx]
    question_text = "\n".join([line for line in question_lines if line.strip()])
    
    outcome_emoji = "✅" if outcome.lower() == "correto" else "❌"
    
    output_md += f"## Pergunta {q_num} {outcome_emoji}\n\n"
    output_md += f"**{question_text.strip()}**\n\n"
    
    for alt in alternatives:
        if alt['user_selected'] and alt['is_correct']:
            prefix = "- [x] **(Sua escolha - Correta)**"
        elif alt['user_selected'] and not alt['is_correct']:
            prefix = "- [x] **(Sua escolha - Incorreta)**"
        elif not alt['user_selected'] and alt['is_correct']:
            prefix = "- [ ] **(Alternativa Correta)**"
        else:
            prefix = "- [ ]"
            
        output_md += f"{prefix} {alt['text']}\n"
    
    # Try to extract the general explanation
    # It usually starts at "Explicação geral"
    try:
        geral_idx = q_body.index("Explicação geral")
        geral_lines = []
        for line in q_body[geral_idx+1:]:
            if line.startswith("Referências:"):
                break
            if line.strip():
                geral_lines.append(line.strip())
        geral_text = "\n> ".join(geral_lines)
        if geral_text:
            output_md += f"\n> **Explicação Geral:**\n> {geral_text}\n"
    except ValueError:
        pass
        
    output_md += "\n---\n\n"

with open('/Users/mile/Documents/controle-financeiro/Resultados-Simulado-2.md', 'w', encoding='utf-8') as f:
    f.write(output_md)
print("Parsing complete.")
